// Tournament Bracket Engine (Mode 3: Neon Kupa)
import { getTeamsByLeague, TEAMS } from './teamsData.js';

export class TournamentManager {
  constructor() {
    this.bracket = null;
    this.currentMatch = null;
    this.currentRoundIndex = 0;
    this.currentMatchIndex = 0;
  }

  createTournament(leagueId = 'superlig') {
    let teams = getTeamsByLeague(leagueId);
    if (!teams || teams.length < 8) {
      teams = TEAMS.slice(0, 8);
    }

    // Pick top 8 teams or shuffle
    const selected8 = [...teams].slice(0, 8);

    this.bracket = {
      quarterFinals: [
        { id: 'qf1', teamA: selected8[0], teamB: selected8[1], scoreA: null, scoreB: null, winner: null },
        { id: 'qf2', teamA: selected8[2], teamB: selected8[3], scoreA: null, scoreB: null, winner: null },
        { id: 'qf3', teamA: selected8[4], teamB: selected8[5], scoreA: null, scoreB: null, winner: null },
        { id: 'qf4', teamA: selected8[6], teamB: selected8[7], scoreA: null, scoreB: null, winner: null }
      ],
      semiFinals: [
        { id: 'sf1', teamA: null, teamB: null, scoreA: null, scoreB: null, winner: null },
        { id: 'sf2', teamA: null, teamB: null, scoreA: null, scoreB: null, winner: null }
      ],
      final: { id: 'final', teamA: null, teamB: null, scoreA: null, scoreB: null, winner: null },
      champion: null
    };

    this.currentRound = 'quarterFinals';
    this.currentMatchIndex = 0;
    this.currentMatch = this.bracket.quarterFinals[0];
    return this.bracket;
  }

  recordMatchResult(scoreA, scoreB) {
    if (!this.currentMatch) return;

    // In tournament, resolve ties if needed
    let finalScoreA = scoreA;
    let finalScoreB = scoreB;
    if (finalScoreA === finalScoreB) {
      if (Math.random() > 0.5) finalScoreA += 1;
      else finalScoreB += 1;
    }

    this.currentMatch.scoreA = finalScoreA;
    this.currentMatch.scoreB = finalScoreB;
    const winner = finalScoreA > finalScoreB ? this.currentMatch.teamA : this.currentMatch.teamB;
    this.currentMatch.winner = winner;

    // Advance in bracket
    if (this.currentRound === 'quarterFinals') {
      const qfIdx = this.currentMatchIndex;
      if (qfIdx === 0) this.bracket.semiFinals[0].teamA = winner;
      else if (qfIdx === 1) this.bracket.semiFinals[0].teamB = winner;
      else if (qfIdx === 2) this.bracket.semiFinals[1].teamA = winner;
      else if (qfIdx === 3) this.bracket.semiFinals[1].teamB = winner;

      if (this.currentMatchIndex < 3) {
        this.currentMatchIndex++;
        this.currentMatch = this.bracket.quarterFinals[this.currentMatchIndex];
      } else {
        this.currentRound = 'semiFinals';
        this.currentMatchIndex = 0;
        this.currentMatch = this.bracket.semiFinals[0];
      }
    } else if (this.currentRound === 'semiFinals') {
      const sfIdx = this.currentMatchIndex;
      if (sfIdx === 0) this.bracket.final.teamA = winner;
      else if (sfIdx === 1) this.bracket.final.teamB = winner;

      if (this.currentMatchIndex < 1) {
        this.currentMatchIndex++;
        this.currentMatch = this.bracket.semiFinals[1];
      } else {
        this.currentRound = 'final';
        this.currentMatchIndex = 0;
        this.currentMatch = this.bracket.final;
      }
    } else if (this.currentRound === 'final') {
      this.bracket.champion = winner;
      this.currentMatch = null;
    }

    return {
      winner,
      nextMatch: this.currentMatch,
      champion: this.bracket.champion
    };
  }

  getCurrentRoundTitle() {
    if (this.currentRound === 'quarterFinals') {
      return `Çeyrek Final (${this.currentMatchIndex + 1}/4)`;
    } else if (this.currentRound === 'semiFinals') {
      return `Yarı Final (${this.currentMatchIndex + 1}/2)`;
    } else if (this.currentRound === 'final') {
      return 'BÜYÜK FİNAL';
    }
    return 'KUPA TAMAMLANDI';
  }
}

export const tournamentManager = new TournamentManager();
