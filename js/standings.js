// League Standings and Persistent Statistics Manager
import { LEAGUES, getTeamsByLeague } from './teamsData.js';

const STORAGE_KEY = 'neon_futbol_standings_v1';

export class StandingsManager {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return this.initDefaultData();
  }

  save() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  initDefaultData() {
    const data = {};
    LEAGUES.forEach(league => {
      const teams = getTeamsByLeague(league.id);
      data[league.id] = teams.map(t => ({
        id: t.id,
        name: t.name,
        short: t.short,
        neon: t.neon,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0, // Goals For
        ga: 0, // Goals Against
        gd: 0, // Goal Difference
        points: 0
      }));
    });
    return data;
  }

  resetAll() {
    this.data = this.initDefaultData();
    this.save();
    return this.data;
  }

  resetLeague(leagueId) {
    const teams = getTeamsByLeague(leagueId);
    this.data[leagueId] = teams.map(t => ({
      id: t.id,
      name: t.name,
      short: t.short,
      neon: t.neon,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0
    }));
    this.save();
    return this.data[leagueId];
  }

  recordMatch(teamA, teamB, scoreA, scoreB) {
    const updateTeamInLeague = (leagueId, teamId, scored, conceded) => {
      if (!this.data[leagueId]) return;
      const row = this.data[leagueId].find(t => t.id === teamId);
      if (!row) return;

      row.played += 1;
      row.gf += scored;
      row.ga += conceded;
      row.gd = row.gf - row.ga;

      if (scored > conceded) {
        row.won += 1;
        row.points += 3;
      } else if (scored === conceded) {
        row.drawn += 1;
        row.points += 1;
      } else {
        row.lost += 1;
      }
    };

    updateTeamInLeague(teamA.league, teamA.id, scoreA, scoreB);
    updateTeamInLeague(teamB.league, teamB.id, scoreB, scoreA);
    this.save();
  }

  getSortedLeagueTable(leagueId) {
    if (!this.data[leagueId]) {
      this.resetLeague(leagueId);
    }
    const table = [...this.data[leagueId]];
    table.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.name.localeCompare(b.name);
    });
    return table;
  }
}

export const standingsManager = new StandingsManager();
