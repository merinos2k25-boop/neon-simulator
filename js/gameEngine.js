// Game Lifecycle & Modes Engine
import { soundEngine } from './audio.js';
import { standingsManager } from './standings.js';

export const GAME_MODES = {
  KICKOFF: 'kickoff',        // Mode 1: 1v1 Two-team match
  BATTLE_ROYALE: 'battle',    // Mode 2: League All-Team Elimination
  TOURNAMENT: 'tournament'   // Mode 3: Neon Tournament Cup Bracket
};

export class GameEngine {
  constructor(physicsEngine) {
    this.physics = physicsEngine;

    // Match State
    this.mode = GAME_MODES.KICKOFF;
    this.state = 'idle'; // 'idle', 'first_half', 'half_time', 'second_half', 'extra_time', 'finished'
    
    // Time tracking (in simulated match minutes: 0 to 95)
    this.matchMinute = 0;
    this.targetMinute = 95; // 45 + 45 + 5 extra
    this.realSecondsPerMatchMinute = 0.5; // At 1x speed, 0.5s real time = 1 match minute. At 2x speed, ~23s for 90 mins!
    this.clockSpeed = 2.0; // 2x 4x 8x controls match clock speed, NOT ball physics!

    // Teams & Scores (Mode 1)
    this.teamA = null;
    this.teamB = null;
    this.scoreA = 0;
    this.scoreB = 0;

    // Mode 2: Battle Royale State
    this.selectedLeagueId = 'superlig';
    this.allLeagueTeams = [];
    this.eliminatedTeams = [];
    this.remainingTeams = [];
    this.championTeam = null;

    // Mode 3: Tournament State
    this.tournamentRounds = [];
    this.currentTournamentMatchIndex = 0;

    // Callbacks for UI updates
    this.onScoreUpdate = null;
    this.onTimeUpdate = null;
    this.onStateChange = null;
    this.onGoalEvent = null;
    this.onEliminationEvent = null;
    this.onMatchFinished = null;

    // Bind Physics Callbacks
    this.physics.onGoal = (puck) => this.handleGoal(puck);
    this.physics.onElimination = (team, remainingCount) => this.handleElimination(team, remainingCount);

    this.lastFrameTime = performance.now();
    this.goalPauseTimer = 0;
  }

  setSpeed(speed) {
    this.clockSpeed = speed;
    // Ball physics remains smooth and natural (speeding up clock only)
  }

  // --- MODE 1: KICK OFF ---
  initKickoff(teamA, teamB) {
    this.mode = GAME_MODES.KICKOFF;
    this.teamA = teamA;
    this.teamB = teamB;
    this.scoreA = 0;
    this.scoreB = 0;
    this.matchMinute = 0;
    this.state = 'idle';

    this.physics.setPucks([
      { team: teamA, side: 'home' },
      { team: teamB, side: 'away' }
    ], false);

    this.notifyUI();
  }

  startMatch() {
    if (this.state === 'idle') {
      soundEngine.init();
      soundEngine.playWhistle('short');
      this.state = 'first_half';
      this.physics.paused = false;
      this.notifyUI();
    } else if (this.state === 'half_time') {
      soundEngine.playWhistle('short');
      this.state = 'second_half';
      this.physics.paused = false;
      this.physics.resetKickoff('neutral');
      this.notifyUI();
    }
  }

  pauseMatch() {
    this.physics.paused = !this.physics.paused;
    this.notifyUI();
  }

  restartMatch() {
    if (this.mode === GAME_MODES.KICKOFF) {
      this.initKickoff(this.teamA, this.teamB);
    } else if (this.mode === GAME_MODES.BATTLE_ROYALE) {
      this.initBattleRoyale(this.selectedLeagueId, this.allLeagueTeams);
    }
  }

  handleGoal(puck) {
    if (this.state !== 'first_half' && this.state !== 'second_half' && this.state !== 'extra_time') {
      return;
    }

    if (puck.side === 'home') {
      this.scoreA += 1;
    } else {
      this.scoreB += 1;
    }

    // Pause physics briefly during goal celebration
    this.goalPauseTimer = 1.6 / (this.gameSpeed > 2 ? 1.5 : 1.0);

    if (this.onGoalEvent) {
      this.onGoalEvent({
        team: puck.team,
        side: puck.side,
        minute: Math.floor(this.matchMinute),
        scoreA: this.scoreA,
        scoreB: this.scoreB
      });
    }

    this.notifyUI();
  }

  // --- MODE 2: BATTLE ROYALE (Lig Çember Eleme) ---
  initBattleRoyale(leagueId, teamsList) {
    this.mode = GAME_MODES.BATTLE_ROYALE;
    this.selectedLeagueId = leagueId;
    this.allLeagueTeams = [...teamsList];
    this.remainingTeams = [...teamsList];
    this.eliminatedTeams = [];
    this.championTeam = null;
    this.state = 'idle';

    const pucksData = teamsList.map(t => ({ team: t, side: 'battle' }));
    this.physics.setPucks(pucksData, true);

    this.notifyUI();
  }

  startBattleRoyale() {
    soundEngine.init();
    soundEngine.playWhistle('short');
    this.state = 'battle_active';
    this.physics.paused = false;
    this.notifyUI();
  }

  handleElimination(eliminatedTeam, remainingCount) {
    this.eliminatedTeams.push({
      team: eliminatedTeam,
      rank: this.allLeagueTeams.length - this.eliminatedTeams.length
    });

    this.remainingTeams = this.remainingTeams.filter(t => t.id !== eliminatedTeam.id);

    if (this.onEliminationEvent) {
      this.onEliminationEvent({
        eliminatedTeam,
        remainingCount: this.remainingTeams.length,
        totalCount: this.allLeagueTeams.length
      });
    }

    // Check if only 1 survivor remains!
    if (this.remainingTeams.length === 1) {
      this.championTeam = this.remainingTeams[0];
      this.state = 'battle_finished';
      this.physics.paused = true;
      soundEngine.playChampionFanfare();

      if (this.onMatchFinished) {
        this.onMatchFinished({
          mode: GAME_MODES.BATTLE_ROYALE,
          champion: this.championTeam,
          eliminatedList: this.eliminatedTeams
        });
      }
    }

    this.notifyUI();
  }

  // --- MASTER UPDATE TICK ---
  tick(currentTime) {
    const dt = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;

    // Handle Goal Celebration Pause in 1v1
    const freezePucks = this.goalPauseTimer > 0;
    if (freezePucks) {
      this.goalPauseTimer -= dt;
      if (this.goalPauseTimer <= 0) {
        this.physics.resetKickoff('neutral');
      }
    }
    this.physics.update(dt, freezePucks);

    // Advance Match Clock for Kickoff & Tournament Modes
    if (this.mode === GAME_MODES.KICKOFF || this.mode === GAME_MODES.TOURNAMENT) {
      if (this.state === 'first_half' || this.state === 'second_half' || this.state === 'extra_time') {
        const minuteRate = (1 / this.realSecondsPerMatchMinute) * this.clockSpeed;
        this.matchMinute += dt * minuteRate;

        // Half-Time Check at 45'
        if (this.state === 'first_half' && this.matchMinute >= 45) {
          this.matchMinute = 45;
          this.state = 'half_time';
          this.physics.paused = true;
          soundEngine.playWhistle('halfTime');
          this.notifyUI();
        }

        // Stoppage time indicator at 90'
        if (this.state === 'second_half' && this.matchMinute >= 90) {
          this.state = 'extra_time';
          this.notifyUI();
        }

        // Full-time finish at 95' (90 + 5)
        if (this.matchMinute >= 95) {
          this.matchMinute = 95;
          this.state = 'finished';
          this.physics.paused = true;
          soundEngine.playWhistle('fullTime');

          // Save to standings
          standingsManager.recordMatch(this.teamA, this.teamB, this.scoreA, this.scoreB);

          if (this.onMatchFinished) {
            this.onMatchFinished({
              mode: GAME_MODES.KICKOFF,
              teamA: this.teamA,
              teamB: this.teamB,
              scoreA: this.scoreA,
              scoreB: this.scoreB,
              totalGoals: this.scoreA + this.scoreB
            });
          }
          this.notifyUI();
        }
      }
    }

    // Always render canvas
    this.physics.render();
  }

  notifyUI() {
    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.scoreA, this.scoreB);
    }
    if (this.onTimeUpdate) {
      this.onTimeUpdate(Math.floor(this.matchMinute), this.state);
    }
    if (this.onStateChange) {
      this.onStateChange(this.state);
    }
  }
}
