// Tournament Bracket Knockout Engine (Mode 3: Neon Kupa)
import { getTeamsByLeague, TEAMS } from './teamsData.js';

export class TournamentManager {
  constructor() {
    this.bracket = null;
    this.currentRound = 'quarterFinals'; // 'quarterFinals', 'semiFinals', 'final', 'completed'
    this.userTeam = null;
    this.currentMatch = null;
    this.activeLeagueId = 'superlig';
    this.userEliminated = false;
  }

  // Create a fresh tournament with 8 random teams from the league
  createTournament(leagueId = 'superlig', preferredUserTeam = null) {
    this.activeLeagueId = leagueId;
    let pool = getTeamsByLeague(leagueId);
    if (!pool || pool.length < 8) {
      pool = [...TEAMS];
    }

    // Shuffle pool randomly
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    // If preferredUserTeam is provided, use it; otherwise use first shuffled team
    let userTeam = preferredUserTeam || shuffled[0];
    const other7 = shuffled.filter(t => t.id !== userTeam.id).slice(0, 7);

    // 8 teams in the tournament
    const qfTeams = [userTeam, ...other7];

    this.userTeam = userTeam;
    this.userEliminated = false;

    this.bracket = {
      quarterFinals: [
        { id: 'qf1', title: 'Çeyrek Final (1/4)', teamA: qfTeams[0], teamB: qfTeams[1], scoreA: null, scoreB: null, winner: null, isUserMatch: true },
        { id: 'qf2', title: 'Çeyrek Final (2/4)', teamA: qfTeams[2], teamB: qfTeams[3], scoreA: null, scoreB: null, winner: null, isUserMatch: false },
        { id: 'qf3', title: 'Çeyrek Final (3/4)', teamA: qfTeams[4], teamB: qfTeams[5], scoreA: null, scoreB: null, winner: null, isUserMatch: false },
        { id: 'qf4', title: 'Çeyrek Final (4/4)', teamA: qfTeams[6], teamB: qfTeams[7], scoreA: null, scoreB: null, winner: null, isUserMatch: false }
      ],
      semiFinals: [
        { id: 'sf1', title: 'Yarı Final (1/2)', teamA: null, teamB: null, scoreA: null, scoreB: null, winner: null, isUserMatch: true },
        { id: 'sf2', title: 'Yarı Final (2/2)', teamA: null, teamB: null, scoreA: null, scoreB: null, winner: null, isUserMatch: false }
      ],
      final: { id: 'final', title: 'BÜYÜK FİNAL 🏆', teamA: null, teamB: null, scoreA: null, scoreB: null, winner: null, isUserMatch: true },
      champion: null
    };

    this.currentRound = 'quarterFinals';
    this.currentMatch = this.bracket.quarterFinals[0];
    return this.bracket;
  }

  // Shuffle the 8 teams randomly from the active league
  randomizeTeams(leagueId = this.activeLeagueId) {
    return this.createTournament(leagueId, this.userTeam);
  }

  // Manually replace any team in a quarterfinal slot
  setTeamInSlot(qfIndex, side, newTeam) {
    if (!this.bracket || !this.bracket.quarterFinals[qfIndex]) return;
    const match = this.bracket.quarterFinals[qfIndex];
    match[side] = newTeam;

    if (qfIndex === 0 && side === 'teamA') {
      this.userTeam = newTeam;
    }

    // Reset progress so new bracket can be played cleanly
    this.resetProgression();
  }

  // Set any team in the bracket as the user's team
  setUserTeam(team) {
    if (!this.bracket) return;
    this.userTeam = team;
    this.bracket.quarterFinals[0].teamA = team;
    this.resetProgression();
  }

  resetProgression() {
    this.currentRound = 'quarterFinals';
    this.userEliminated = false;
    this.bracket.champion = null;

    this.bracket.quarterFinals.forEach(m => {
      m.scoreA = null;
      m.scoreB = null;
      m.winner = null;
    });

    this.bracket.semiFinals.forEach(m => {
      m.teamA = null;
      m.teamB = null;
      m.scoreA = null;
      m.scoreB = null;
      m.winner = null;
    });

    this.bracket.final.teamA = null;
    this.bracket.final.teamB = null;
    this.bracket.final.scoreA = null;
    this.bracket.final.scoreB = null;
    this.bracket.final.winner = null;

    this.currentMatch = this.bracket.quarterFinals[0];
  }

  // Simulate an AI match between other bracket teams with realistic football scores
  simulateAiMatch(teamA, teamB) {
    let sA = Math.floor(Math.random() * 4);
    let sB = Math.floor(Math.random() * 4);
    if (sA === sB) {
      if (Math.random() > 0.5) sA += 1;
      else sB += 1;
    }
    return {
      scoreA: sA,
      scoreB: sB,
      winner: sA > sB ? teamA : teamB
    };
  }

  // Record user match result and advance tournament knockout tree
  recordMatchResult(scoreA, scoreB) {
    if (!this.currentMatch) return null;

    // Tie breaker if drawn
    let finalScoreA = scoreA;
    let finalScoreB = scoreB;
    if (finalScoreA === finalScoreB) {
      if (Math.random() > 0.5) finalScoreA += 1;
      else finalScoreB += 1;
    }

    this.currentMatch.scoreA = finalScoreA;
    this.currentMatch.scoreB = finalScoreB;
    const matchWinner = finalScoreA > finalScoreB ? this.currentMatch.teamA : this.currentMatch.teamB;
    this.currentMatch.winner = matchWinner;

    const isUserWinner = matchWinner.id === this.userTeam.id;

    if (!isUserWinner) {
      // User lost at this stage
      this.userEliminated = true;
      return {
        stage: this.currentRound,
        userWon: false,
        winner: matchWinner,
        userTeam: this.userTeam,
        champion: null
      };
    }

    // USER WON! Advance to the next knockout round
    if (this.currentRound === 'quarterFinals') {
      // 1. User advances to Semi-Final 1 (as teamA)
      this.bracket.semiFinals[0].teamA = matchWinner;

      // 2. Simulate other 3 QF matches
      for (let i = 1; i <= 3; i++) {
        const m = this.bracket.quarterFinals[i];
        if (!m.winner) {
          const sim = this.simulateAiMatch(m.teamA, m.teamB);
          m.scoreA = sim.scoreA;
          m.scoreB = sim.scoreB;
          m.winner = sim.winner;
        }
      }

      // QF2 winner goes to SF1 teamB (User's opponent in Semi-Final!)
      this.bracket.semiFinals[0].teamB = this.bracket.quarterFinals[1].winner;

      // QF3 & QF4 winners go to SF2
      this.bracket.semiFinals[1].teamA = this.bracket.quarterFinals[2].winner;
      this.bracket.semiFinals[1].teamB = this.bracket.quarterFinals[3].winner;

      this.currentRound = 'semiFinals';
      this.currentMatch = this.bracket.semiFinals[0];

      return {
        stage: 'quarterFinals',
        nextStage: 'semiFinals',
        userWon: true,
        winner: matchWinner,
        userTeam: this.userTeam,
        nextOpponent: this.bracket.semiFinals[0].teamB,
        champion: null
      };
    } else if (this.currentRound === 'semiFinals') {
      // 1. User advances to Grand Final (as teamA)
      this.bracket.final.teamA = matchWinner;

      // 2. Simulate SF2 (the other semi-final)
      const sf2 = this.bracket.semiFinals[1];
      if (!sf2.winner) {
        const sim = this.simulateAiMatch(sf2.teamA, sf2.teamB);
        sf2.scoreA = sim.scoreA;
        sf2.scoreB = sim.scoreB;
        sf2.winner = sim.winner;
      }

      // SF2 winner goes to Final teamB (User's opponent in Grand Final!)
      this.bracket.final.teamB = sf2.winner;

      this.currentRound = 'final';
      this.currentMatch = this.bracket.final;

      return {
        stage: 'semiFinals',
        nextStage: 'final',
        userWon: true,
        winner: matchWinner,
        userTeam: this.userTeam,
        nextOpponent: this.bracket.final.teamB,
        champion: null
      };
    } else if (this.currentRound === 'final') {
      // USER WON GRAND FINAL -> CHAMPION!
      this.bracket.champion = matchWinner;
      this.currentRound = 'completed';
      this.currentMatch = null;

      return {
        stage: 'final',
        nextStage: 'completed',
        userWon: true,
        winner: matchWinner,
        userTeam: this.userTeam,
        champion: matchWinner
      };
    }
  }

  getCurrentRoundTitle() {
    if (this.currentRound === 'quarterFinals') {
      return 'Çeyrek Final (1. Tur)';
    } else if (this.currentRound === 'semiFinals') {
      return 'Yarı Final (2. Tur)';
    } else if (this.currentRound === 'final') {
      return 'BÜYÜK FİNAL 🏆';
    }
    return 'KUPA ŞAMPİYONU 👑';
  }
}

export const tournamentManager = new TournamentManager();
