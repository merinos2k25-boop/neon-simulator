// Neon Football Simulator - Main Application Controller
import { LEAGUES, TEAMS, getTeamsByLeague, getTeamById } from './teamsData.js';
import { soundEngine } from './audio.js';
import { standingsManager } from './standings.js';
import { PhysicsEngine } from './physics.js';
import { GameEngine, GAME_MODES } from './gameEngine.js';
import { tournamentManager } from './tournament.js';

class NeonFutbolApp {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.physics = new PhysicsEngine(this.canvas);
    this.game = new GameEngine(this.physics);

    // Initial Teams (Fenerbahçe vs Liverpool - matches user's screenshot!)
    this.teamA = getTeamById('fen') || getTeamsByLeague('superlig')[1];
    this.teamB = getTeamById('liv') || getTeamsByLeague('premier')[2];

    this.currentLeagueId = 'superlig';
    this.selectionTarget = 'teamA'; // 'teamA', 'teamB', or 'battleLeague'

    this.initDOM();
    this.bindEvents();
    this.setupGameCallbacks();

    // Start with 1v1 Kick Off
    this.setMode(GAME_MODES.KICKOFF);

    // Start Animation Loop
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  initDOM() {
    // Mode tabs
    this.modeTabs = document.querySelectorAll('.mode-tab');

    // Scoreboard Elements
    this.kickoffScoreboard = document.getElementById('kickoffScoreboard');
    this.battleScoreboard = document.getElementById('battleScoreboard');
    this.tournamentScoreboard = document.getElementById('tournamentScoreboard');
    this.tournamentRoundTitle = document.getElementById('tournamentRoundTitle');

    this.teamBadgeImgA = document.getElementById('teamBadgeImgA');
    this.teamBadgeImgB = document.getElementById('teamBadgeImgB');
    this.teamNameA = document.getElementById('teamNameA');
    this.teamNameB = document.getElementById('teamNameB');
    this.teamCardA = document.getElementById('teamCardA');
    this.teamCardB = document.getElementById('teamCardB');
    this.scoreDigitA = document.getElementById('scoreDigitA');
    this.scoreDigitB = document.getElementById('scoreDigitB');
    this.timerMinute = document.getElementById('timerMinute');
    this.timerStatus = document.getElementById('timerStatus');

    // Battle Royale (Lig Geneli) Header Elements
    this.battleLeagueIcon = document.getElementById('battleLeagueIcon');
    this.battleLeagueTitle = document.getElementById('battleLeagueTitle');
    this.battleRemainingCount = document.getElementById('battleRemainingCount');
    this.battleLastEliminated = document.getElementById('battleLastEliminated');
    this.btnChangeBattleLeague = document.getElementById('btnChangeBattleLeague');

    // Goal & Elimination Popups
    this.goalPopup = document.getElementById('goalPopup');
    this.goalTeamLabel = document.getElementById('goalTeamLabel');
    this.elimPopup = document.getElementById('elimPopup');
    this.elimTeamName = document.getElementById('elimTeamName');

    // Controls
    this.btnMainPlay = document.getElementById('btnMainPlay');
    this.btnMainPlayIcon = document.getElementById('btnMainPlayIcon');
    this.btnMainPlayText = document.getElementById('btnMainPlayText');
    this.btnRestart = document.getElementById('btnRestart');
    this.btnSoundToggle = document.getElementById('btnSoundToggle');
    this.speedBtns = document.querySelectorAll('.speed-btn');

    // Modals
    this.teamsModal = document.getElementById('teamsModal');
    this.standingsModal = document.getElementById('standingsModal');
    this.resultModal = document.getElementById('resultModal');
    this.tournamentModal = document.getElementById('tournamentModal');

    this.btnSelectTeams = document.getElementById('btnSelectTeams');
    this.btnStandings = document.getElementById('btnStandings');
    this.btnViewBracket = document.getElementById('btnViewBracket');
    this.btnCloseTeamsModal = document.getElementById('btnCloseTeamsModal');
    this.btnCloseStandingsModal = document.getElementById('btnCloseStandingsModal');
    this.btnCloseResultModal = document.getElementById('btnCloseResultModal');
    this.btnCloseTournamentModal = document.getElementById('btnCloseTournamentModal');

    this.modalLeagueTabs = document.getElementById('modalLeagueTabs');
    this.modalTeamsGrid = document.getElementById('modalTeamsGrid');
    this.standingsLeagueTabs = document.getElementById('standingsLeagueTabs');
    this.standingsTableBody = document.getElementById('standingsTableBody');
    this.tournamentBracketTreeContainer = document.getElementById('tournamentBracketTreeContainer');

    this.btnResetCurrentLeague = document.getElementById('btnResetCurrentLeague');
    this.btnResetAllData = document.getElementById('btnResetAllData');
    this.btnResetTournament = document.getElementById('btnResetTournament');
    this.btnContinueTournament = document.getElementById('btnContinueTournament');
    this.btnRandomMatch = document.getElementById('btnRandomMatch');
    this.btnConfirmSelection = document.getElementById('btnConfirmSelection');
    this.btnRematch = document.getElementById('btnRematch');
    this.btnNewMatch = document.getElementById('btnNewMatch');
  }

  bindEvents() {
    window.addEventListener('resize', () => this.physics.resize());

    // Mode Switcher
    this.modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const mode = tab.dataset.mode;
        this.setMode(mode);
      });
    });

    // Scoreboard clicks to change teams
    this.teamCardA.addEventListener('click', () => {
      if (this.game.mode === GAME_MODES.KICKOFF) {
        this.openTeamSelectionModal('teamA');
      }
    });
    this.teamCardB.addEventListener('click', () => {
      if (this.game.mode === GAME_MODES.KICKOFF) {
        this.openTeamSelectionModal('teamB');
      }
    });

    // Controls
    this.btnMainPlay.addEventListener('click', () => this.handleMainPlay());
    this.btnRestart.addEventListener('click', () => {
      this.game.restartMatch();
      this.updatePlayButton();
    });

    this.btnSoundToggle.addEventListener('click', () => {
      const isMuted = soundEngine.toggleMute();
      this.btnSoundToggle.textContent = isMuted ? '🔇' : '🔊';
    });

    this.speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.speedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const speed = parseFloat(btn.dataset.speed);
        this.game.setSpeed(speed);
      });
    });

    // Modals Triggers
    if (this.btnChangeBattleLeague) {
      this.btnChangeBattleLeague.addEventListener('click', () => {
        this.openTeamSelectionModal('battleLeague');
      });
    }

    this.btnSelectTeams.addEventListener('click', () => {
      if (this.game.mode === GAME_MODES.BATTLE_ROYALE) {
        this.openTeamSelectionModal('battleLeague');
      } else {
        this.openTeamSelectionModal('teamA');
      }
    });

    this.btnStandings.addEventListener('click', () => this.openStandingsModal(this.currentLeagueId));

    if (this.btnViewBracket) {
      this.btnViewBracket.addEventListener('click', () => this.openTournamentBracketModal());
    }

    this.btnCloseTeamsModal.addEventListener('click', () => this.closeModal(this.teamsModal));
    this.btnCloseStandingsModal.addEventListener('click', () => this.closeModal(this.standingsModal));
    this.btnCloseResultModal.addEventListener('click', () => this.closeModal(this.resultModal));
    this.btnCloseTournamentModal.addEventListener('click', () => this.closeModal(this.tournamentModal));

    // Standings reset buttons
    this.btnResetCurrentLeague.addEventListener('click', () => {
      if (confirm('Bu ligin puan tablosunu sıfırlamak istediğinize emin misiniz?')) {
        standingsManager.resetLeague(this.currentLeagueId);
        this.renderStandingsTable(this.currentLeagueId);
      }
    });

    this.btnResetAllData.addEventListener('click', () => {
      if (confirm('TÜM liglerin puan tabloları ve istatistikleri sıfırlanacak. Onaylıyor musunuz?')) {
        standingsManager.resetAll();
        this.renderStandingsTable(this.currentLeagueId);
      }
    });

    // Tournament Reset
    if (this.btnResetTournament) {
      this.btnResetTournament.addEventListener('click', () => {
        if (confirm('Turnuvayı baştan başlatmak istiyor musunuz?')) {
          tournamentManager.createTournament(this.currentLeagueId);
          this.loadTournamentMatch();
          this.closeModal(this.tournamentModal);
        }
      });
    }

    if (this.btnContinueTournament) {
      this.btnContinueTournament.addEventListener('click', () => this.closeModal(this.tournamentModal));
    }

    // Random Match
    this.btnRandomMatch.addEventListener('click', () => {
      const randA = TEAMS[Math.floor(Math.random() * TEAMS.length)];
      let randB = TEAMS[Math.floor(Math.random() * TEAMS.length)];
      while (randB.id === randA.id) {
        randB = TEAMS[Math.floor(Math.random() * TEAMS.length)];
      }
      this.teamA = randA;
      this.teamB = randB;
      this.closeModal(this.teamsModal);
      this.game.initKickoff(this.teamA, this.teamB);
      this.updateScoreboardDisplay();
      this.updatePlayButton();
    });

    this.btnConfirmSelection.addEventListener('click', () => {
      this.closeModal(this.teamsModal);
      if (this.game.mode === GAME_MODES.KICKOFF) {
        this.game.initKickoff(this.teamA, this.teamB);
      } else {
        const leagueTeams = getTeamsByLeague(this.currentLeagueId);
        this.game.initBattleRoyale(this.currentLeagueId, leagueTeams);
      }
      this.updateScoreboardDisplay();
      this.updatePlayButton();
    });

    this.btnRematch.addEventListener('click', () => {
      this.closeModal(this.resultModal);
      if (this.game.mode === GAME_MODES.TOURNAMENT) {
        this.advanceTournament();
      } else {
        this.game.restartMatch();
        this.game.startMatch();
        this.updatePlayButton();
      }
    });

    this.btnNewMatch.addEventListener('click', () => {
      this.closeModal(this.resultModal);
      this.openTeamSelectionModal('teamA');
    });
  }

  setupGameCallbacks() {
    this.game.onScoreUpdate = (scoreA, scoreB) => {
      this.scoreDigitA.textContent = scoreA;
      this.scoreDigitB.textContent = scoreB;
    };

    this.game.onTimeUpdate = (minute, state) => {
      this.timerMinute.textContent = `${minute}'`;

      let statusText = '1. YARI';
      if (state === 'first_half') statusText = '1. YARI';
      else if (state === 'half_time') statusText = 'DEVRE ARASI';
      else if (state === 'second_half') statusText = '2. YARI';
      else if (state === 'extra_time') statusText = '+5 UZATMA';
      else if (state === 'finished') statusText = 'MAÇ BİTTİ';

      this.timerStatus.textContent = statusText;
      this.updatePlayButton();
    };

    this.game.onGoalEvent = (event) => {
      this.showGoalPopup(event.team);
    };

    this.game.onEliminationEvent = (event) => {
      this.showEliminationPopup(event.eliminatedTeam);
      this.battleRemainingCount.textContent = `${event.remainingCount}/${event.totalCount} TAKIM`;
      this.battleLastEliminated.textContent = `Son Elenen: ${event.eliminatedTeam.name}`;
    };

    this.game.onMatchFinished = (summary) => {
      this.showMatchFinishedModal(summary);
      this.updatePlayButton();
    };
  }

  setMode(mode) {
    this.modeTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.mode === mode);
    });

    if (mode === GAME_MODES.KICKOFF) {
      this.kickoffScoreboard.style.display = 'flex';
      this.battleScoreboard.style.display = 'none';
      if (this.tournamentScoreboard) this.tournamentScoreboard.style.display = 'none';
      this.game.initKickoff(this.teamA, this.teamB);
      this.updateScoreboardDisplay();
    } else if (mode === GAME_MODES.BATTLE_ROYALE) {
      this.kickoffScoreboard.style.display = 'none';
      this.battleScoreboard.style.display = 'flex';
      if (this.tournamentScoreboard) this.tournamentScoreboard.style.display = 'none';
      const leagueTeams = getTeamsByLeague(this.currentLeagueId);
      this.game.initBattleRoyale(this.currentLeagueId, leagueTeams);
      this.updateBattleScoreboardDisplay();
    } else if (mode === GAME_MODES.TOURNAMENT) {
      // Tournament Knockout Mode
      this.kickoffScoreboard.style.display = 'flex';
      this.battleScoreboard.style.display = 'none';
      if (this.tournamentScoreboard) this.tournamentScoreboard.style.display = 'flex';

      tournamentManager.createTournament(this.currentLeagueId);
      this.loadTournamentMatch();
    }

    this.updatePlayButton();
  }

  loadTournamentMatch() {
    const match = tournamentManager.currentMatch;
    if (match) {
      this.teamA = match.teamA;
      this.teamB = match.teamB;
      this.tournamentRoundTitle.textContent = tournamentManager.getCurrentRoundTitle();
      this.game.initKickoff(this.teamA, this.teamB);
      this.updateScoreboardDisplay();
    }
  }

  advanceTournament() {
    const res = tournamentManager.recordMatchResult(this.game.scoreA, this.game.scoreB);
    if (res && res.champion) {
      alert(`👑 TEBRİKLER! ${res.champion.name.toUpperCase()} KUPAYI KAZANDI!`);
      this.setMode(GAME_MODES.KICKOFF);
    } else {
      this.loadTournamentMatch();
      this.game.startMatch();
      this.updatePlayButton();
    }
  }

  handleMainPlay() {
    soundEngine.init();
    if (this.game.mode === GAME_MODES.KICKOFF || this.game.mode === GAME_MODES.TOURNAMENT) {
      if (this.game.state === 'idle' || this.game.state === 'half_time') {
        this.game.startMatch();
      } else if (this.game.state === 'finished') {
        if (this.game.mode === GAME_MODES.TOURNAMENT) {
          this.advanceTournament();
        } else {
          this.game.restartMatch();
          this.game.startMatch();
        }
      } else {
        this.game.pauseMatch();
      }
    } else if (this.game.mode === GAME_MODES.BATTLE_ROYALE) {
      if (this.game.state === 'idle') {
        this.game.startBattleRoyale();
      } else if (this.game.state === 'battle_finished') {
        const leagueTeams = getTeamsByLeague(this.currentLeagueId);
        this.game.initBattleRoyale(this.currentLeagueId, leagueTeams);
        this.game.startBattleRoyale();
      } else {
        this.game.pauseMatch();
      }
    }
    this.updatePlayButton();
  }

  updatePlayButton() {
    const isPaused = this.physics.paused;
    const state = this.game.state;

    if (state === 'idle') {
      this.btnMainPlay.className = 'play-action-btn';
      this.btnMainPlayIcon.textContent = '▶';
      this.btnMainPlayText.textContent = 'BAŞLAT';
    } else if (state === 'half_time') {
      this.btnMainPlay.className = 'play-action-btn paused';
      this.btnMainPlayIcon.textContent = '▶';
      this.btnMainPlayText.textContent = '2. YARIYI BAŞLAT';
    } else if (state === 'finished' || state === 'battle_finished') {
      this.btnMainPlay.className = 'play-action-btn';
      this.btnMainPlayIcon.textContent = '🔄';
      this.btnMainPlayText.textContent = this.game.mode === GAME_MODES.TOURNAMENT ? 'SIRADAKİ MAÇ' : 'YENİDEN OYNA';
    } else if (isPaused) {
      this.btnMainPlay.className = 'play-action-btn paused';
      this.btnMainPlayIcon.textContent = '▶';
      this.btnMainPlayText.textContent = 'DEVAM ET';
    } else {
      this.btnMainPlay.className = 'play-action-btn';
      this.btnMainPlayIcon.textContent = '⏸';
      this.btnMainPlayText.textContent = 'DURAKLAT';
    }
  }

  updateScoreboardDisplay() {
    this.teamBadgeImgA.src = this.teamA.badgeUrl || this.teamA.docxLogoUrl;
    this.teamBadgeImgB.src = this.teamB.badgeUrl || this.teamB.docxLogoUrl;
    this.teamNameA.textContent = this.teamA.name;
    this.teamNameB.textContent = this.teamB.name;

    // CSS variables for neon underlines & glows
    document.documentElement.style.setProperty('--team-a-neon', this.teamA.neon || '#00f0ff');
    document.documentElement.style.setProperty('--team-b-neon', this.teamB.neon || '#ff2b44');

    this.scoreDigitA.textContent = this.game.scoreA;
    this.scoreDigitB.textContent = this.game.scoreB;
    this.timerMinute.textContent = `${Math.floor(this.game.matchMinute)}'`;
  }

  updateBattleScoreboardDisplay() {
    const league = LEAGUES.find(l => l.id === this.currentLeagueId) || LEAGUES[1];
    const teams = getTeamsByLeague(this.currentLeagueId);

    this.battleLeagueIcon.textContent = league.icon;
    this.battleLeagueTitle.textContent = league.name;
    this.battleRemainingCount.textContent = `${teams.length}/${teams.length} TAKIM`;
    this.battleLastEliminated.textContent = 'Başlamaya Hazır';
  }

  showGoalPopup(team) {
    this.goalTeamLabel.textContent = team.name;
    this.goalTeamLabel.style.color = team.neon;
    this.goalPopup.classList.add('active');

    setTimeout(() => {
      this.goalPopup.classList.remove('active');
    }, 1500);
  }

  showEliminationPopup(team) {
    this.elimTeamName.textContent = team.name;
    this.elimPopup.classList.add('active');

    setTimeout(() => {
      this.elimPopup.classList.remove('active');
    }, 1200);
  }

  showMatchFinishedModal(summary) {
    const winnerBadge = document.getElementById('winnerTeamBadge');
    const headline = document.getElementById('winnerHeadline');
    const subtext = document.getElementById('winnerSubtext');
    const finalScoreDisplay = document.getElementById('finalScoreDisplay');
    const totalGoalsStat = document.getElementById('totalGoalsStat');

    if (summary.mode === GAME_MODES.KICKOFF || summary.mode === GAME_MODES.TOURNAMENT) {
      finalScoreDisplay.style.display = 'flex';
      document.getElementById('finalScoreA').textContent = summary.scoreA;
      document.getElementById('finalScoreB').textContent = summary.scoreB;
      totalGoalsStat.textContent = `⚽ Toplam Gol: ${summary.totalGoals}`;

      if (summary.scoreA > summary.scoreB) {
        winnerBadge.src = summary.teamA.badgeUrl || summary.teamA.docxLogoUrl;
        headline.textContent = `${summary.teamA.name.toUpperCase()} KAZANDI!`;
        subtext.textContent = 'Mükemmel bir galibiyet!';
      } else if (summary.scoreB > summary.scoreA) {
        winnerBadge.src = summary.teamB.badgeUrl || summary.teamB.docxLogoUrl;
        headline.textContent = `${summary.teamB.name.toUpperCase()} KAZANDI!`;
        subtext.textContent = 'Harika bir deplasman zaferi!';
      } else {
        winnerBadge.src = summary.teamA.badgeUrl || summary.teamA.docxLogoUrl;
        headline.textContent = 'MAÇ BERABERE BİTTİ!';
        subtext.textContent = `${summary.scoreA} - ${summary.scoreB} Eşitlik bozulmadı!`;
      }
    } else if (summary.mode === GAME_MODES.BATTLE_ROYALE) {
      finalScoreDisplay.style.display = 'none';
      winnerBadge.src = summary.champion.badgeUrl || summary.champion.docxLogoUrl;
      headline.textContent = `👑 ${summary.champion.name.toUpperCase()} ŞAMPİYON!`;
      subtext.textContent = `Çemberdeki tüm rakiplerini eleyerek kupayı kaldırdı!`;
      totalGoalsStat.textContent = `🔥 Elenen Takım Sayısı: ${summary.eliminatedList.length}`;
    }

    this.openModal(this.resultModal);
  }

  // --- MODAL HANDLING ---
  openTeamSelectionModal(target) {
    this.selectionTarget = target;
    const prompt = document.getElementById('teamSelectionPrompt');
    const randomBtn = document.getElementById('btnRandomMatch');

    if (target === 'teamA') {
      prompt.textContent = 'Ev Sahibi Takımı (1. Takım) Seçin:';
      if (randomBtn) randomBtn.style.display = 'block';
      if (this.modalLeagueTabs) this.modalLeagueTabs.style.display = 'flex';
      this.renderLeagueTabs(this.modalLeagueTabs, (leagueId) => {
        this.currentLeagueId = leagueId;
        this.renderTeamsGrid(leagueId);
      });
      this.renderTeamsGrid(this.currentLeagueId);
    } else if (target === 'teamB') {
      prompt.textContent = 'Deplasman Takımını (2. Takım) Seçin:';
      if (randomBtn) randomBtn.style.display = 'block';
      if (this.modalLeagueTabs) this.modalLeagueTabs.style.display = 'flex';
      this.renderLeagueTabs(this.modalLeagueTabs, (leagueId) => {
        this.currentLeagueId = leagueId;
        this.renderTeamsGrid(leagueId);
      });
      this.renderTeamsGrid(this.currentLeagueId);
    } else {
      prompt.textContent = 'Lig Geneli Modu İçin Ligi Seçin (Tüm Takımlar Çembere Girer):';
      if (randomBtn) randomBtn.style.display = 'none';
      if (this.modalLeagueTabs) this.modalLeagueTabs.style.display = 'none';
      this.renderBattleLeagueSelectionGrid();
    }

    this.openModal(this.teamsModal);
  }

  renderBattleLeagueSelectionGrid() {
    this.modalTeamsGrid.innerHTML = '';
    LEAGUES.forEach(league => {
      const teams = getTeamsByLeague(league.id);
      const isSelected = this.currentLeagueId === league.id;

      const item = document.createElement('div');
      item.className = `team-select-item ${isSelected ? 'selected' : ''}`;
      item.style.padding = '12px 14px';
      item.innerHTML = `
        <div style="font-size: 1.8rem; line-height: 1;">${league.icon}</div>
        <div class="team-select-info" style="flex: 1;">
          <div class="team-select-name" style="font-size: 0.95rem;">${league.name}</div>
          <div class="team-select-short" style="color: var(--neon-cyan); font-weight: 700;">${teams.length} Takım Karşılaşacak</div>
        </div>
      `;

      item.addEventListener('click', () => {
        this.currentLeagueId = league.id;
        const lTeams = getTeamsByLeague(this.currentLeagueId);
        this.game.initBattleRoyale(this.currentLeagueId, lTeams);
        this.updateBattleScoreboardDisplay();
        this.updatePlayButton();
        this.closeModal(this.teamsModal);
      });

      this.modalTeamsGrid.appendChild(item);
    });
  }

  renderLeagueTabs(container, onSelect) {
    container.innerHTML = '';
    LEAGUES.forEach(league => {
      const pill = document.createElement('button');
      pill.className = `league-pill ${league.id === this.currentLeagueId ? 'active' : ''}`;
      pill.innerHTML = `<span>${league.icon}</span> <span>${league.name}</span>`;
      pill.addEventListener('click', () => {
        container.querySelectorAll('.league-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        onSelect(league.id);
      });
      container.appendChild(pill);
    });
  }

  renderTeamsGrid(leagueId) {
    this.modalTeamsGrid.innerHTML = '';
    const teams = getTeamsByLeague(leagueId);

    teams.forEach(team => {
      const item = document.createElement('div');
      const isSelected = (this.selectionTarget === 'teamA' && this.teamA.id === team.id) ||
                         (this.selectionTarget === 'teamB' && this.teamB.id === team.id);

      item.className = `team-select-item ${isSelected ? 'selected' : ''}`;
      item.innerHTML = `
        <img class="team-select-badge" src="${team.badgeUrl || team.docxLogoUrl}" alt="${team.name}">
        <div class="team-select-info">
          <div class="team-select-name">${team.name}</div>
          <div class="team-select-short">${team.short}</div>
        </div>
      `;

      item.addEventListener('click', () => {
        if (this.selectionTarget === 'teamA') {
          this.teamA = team;
        } else if (this.selectionTarget === 'teamB') {
          this.teamB = team;
        }
        this.closeModal(this.teamsModal);

        if (this.game.mode === GAME_MODES.KICKOFF) {
          this.game.initKickoff(this.teamA, this.teamB);
        } else {
          const lTeams = getTeamsByLeague(this.currentLeagueId);
          this.game.initBattleRoyale(this.currentLeagueId, lTeams);
        }

        this.updateScoreboardDisplay();
        this.updatePlayButton();
      });

      this.modalTeamsGrid.appendChild(item);
    });
  }

  openStandingsModal(leagueId) {
    this.renderLeagueTabs(this.standingsLeagueTabs, (lId) => {
      this.currentLeagueId = lId;
      this.renderStandingsTable(lId);
    });
    this.renderStandingsTable(leagueId);
    this.openModal(this.standingsModal);
  }

  renderStandingsTable(leagueId) {
    this.standingsTableBody.innerHTML = '';
    const tableData = standingsManager.getSortedLeagueTable(leagueId);

    tableData.forEach((row, index) => {
      const teamObj = getTeamById(row.id);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="standings-rank">${index + 1}</td>
        <td>
          <div class="standings-team-col">
            <img class="standings-team-badge" src="${teamObj.badgeUrl || teamObj.docxLogoUrl}" alt="${row.short}">
            <span>${row.name}</span>
          </div>
        </td>
        <td>${row.played}</td>
        <td>${row.won}</td>
        <td>${row.drawn}</td>
        <td>${row.lost}</td>
        <td>${row.gf}</td>
        <td>${row.ga}</td>
        <td>${row.gd > 0 ? '+' + row.gd : row.gd}</td>
        <td class="standings-points">${row.points}</td>
      `;
      this.standingsTableBody.appendChild(tr);
    });
  }

  openTournamentBracketModal() {
    const container = this.tournamentBracketTreeContainer;
    container.innerHTML = '';
    const bracket = tournamentManager.bracket;
    if (!bracket) return;

    const renderMatchCard = (title, match, isCurrent) => {
      const card = document.createElement('div');
      card.className = `bracket-match-card ${isCurrent ? 'active-match' : ''}`;
      card.innerHTML = `
        <div style="font-size: 0.7rem; color: #94a3b8; font-weight: 700;">${title}</div>
        <div class="bracket-team-row ${match.winner && match.winner.id === match.teamA?.id ? 'winner' : ''}">
          <span>${match.teamA ? match.teamA.name : 'TBD'}</span>
          <span class="bracket-score-pill">${match.scoreA !== null ? match.scoreA : '-'}</span>
        </div>
        <div class="bracket-team-row ${match.winner && match.winner.id === match.teamB?.id ? 'winner' : ''}">
          <span>${match.teamB ? match.teamB.name : 'TBD'}</span>
          <span class="bracket-score-pill">${match.scoreB !== null ? match.scoreB : '-'}</span>
        </div>
      `;
      return card;
    };

    // Quarterfinals
    const qfTitle = document.createElement('div');
    qfTitle.className = 'bracket-stage-title';
    qfTitle.textContent = '⚡ Çeyrek Finaller';
    container.appendChild(qfTitle);

    bracket.quarterFinals.forEach((m, idx) => {
      const isCur = tournamentManager.currentRound === 'quarterFinals' && tournamentManager.currentMatchIndex === idx;
      container.appendChild(renderMatchCard(`Maç ${idx + 1}`, m, isCur));
    });

    // Semifinals
    const sfTitle = document.createElement('div');
    sfTitle.className = 'bracket-stage-title';
    sfTitle.textContent = '🔥 Yarı Finaller';
    container.appendChild(sfTitle);

    bracket.semiFinals.forEach((m, idx) => {
      const isCur = tournamentManager.currentRound === 'semiFinals' && tournamentManager.currentMatchIndex === idx;
      container.appendChild(renderMatchCard(`Yarı Final ${idx + 1}`, m, isCur));
    });

    // Final
    const fTitle = document.createElement('div');
    fTitle.className = 'bracket-stage-title';
    fTitle.textContent = '👑 Büyük Final';
    container.appendChild(fTitle);

    const isFinalCur = tournamentManager.currentRound === 'final';
    container.appendChild(renderMatchCard('Kupa Finali', bracket.final, isFinalCur));

    this.openModal(this.tournamentModal);
  }

  openModal(modal) {
    modal.classList.add('open');
  }

  closeModal(modal) {
    modal.classList.remove('open');
  }

  loop(currentTime) {
    this.game.tick(currentTime);
    requestAnimationFrame(this.loop);
  }
}

// Instantiate app when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.app = new NeonFutbolApp();
});
