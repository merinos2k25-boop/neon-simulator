import json
import os

teams_by_league = {
    "ucl": [
        {"id": "rma", "name": "Real Madrid", "short": "RMA", "c1": "#ffffff", "c2": "#ffd700", "neon": "#ffd700", "pattern": "diagonal"},
        {"id": "mci", "name": "Manchester City", "short": "MCI", "c1": "#6cabdd", "c2": "#1c2c5b", "neon": "#00f0ff", "pattern": "halves"},
        {"id": "bay", "name": "FC Bayern Münih", "short": "BAY", "c1": "#dc052d", "c2": "#0066b2", "neon": "#ff0040", "pattern": "stripes"},
        {"id": "psg", "name": "Paris Saint-Germain", "short": "PSG", "c1": "#004170", "c2": "#da291c", "neon": "#00d4ff", "pattern": "stripes"},
        {"id": "liv", "name": "Liverpool FC", "short": "LIV", "c1": "#c8102e", "c2": "#00b2a9", "neon": "#ff2b44", "pattern": "ring"},
        {"id": "ars", "name": "Arsenal", "short": "ARS", "c1": "#ef0107", "c2": "#ffffff", "neon": "#ff0033", "pattern": "stripes"},
        {"id": "bar", "name": "FC Barcelona", "short": "BAR", "c1": "#a50044", "c2": "#004d98", "neon": "#ff0055", "pattern": "stripes"},
        {"id": "int", "name": "Inter Milan", "short": "INT", "c1": "#001ea0", "c2": "#000000", "neon": "#0066ff", "pattern": "stripes"},
        {"id": "bvb", "name": "Borussia Dortmund", "short": "BVB", "c1": "#fde100", "c2": "#000000", "neon": "#ffe600", "pattern": "stripes"},
        {"id": "atm", "name": "Atlético Madrid", "short": "ATM", "c1": "#cb3524", "c2": "#ffffff", "neon": "#ff3838", "pattern": "stripes"},
        {"id": "lev", "name": "Bayer Leverkusen", "short": "B04", "c1": "#e32221", "c2": "#000000", "neon": "#ff1a1a", "pattern": "cross"},
        {"id": "juv", "name": "Juventus", "short": "JUV", "c1": "#000000", "c2": "#ffffff", "neon": "#ffffff", "pattern": "stripes"},
        {"id": "spo", "name": "Sporting CP", "short": "SCP", "c1": "#008057", "c2": "#ffffff", "neon": "#00ff88", "pattern": "stripes"},
        {"id": "avl", "name": "Aston Villa", "short": "AVL", "c1": "#670e36", "c2": "#95bfe5", "neon": "#95bfe5", "pattern": "halves"},
        {"id": "rbl", "name": "RB Leipzig", "short": "RBL", "c1": "#ffffff", "c2": "#dd0741", "neon": "#ff2255", "pattern": "ring"},
        {"id": "ata", "name": "Atalanta", "short": "ATA", "c1": "#1e71b8", "c2": "#000000", "neon": "#00a2ff", "pattern": "stripes"},
        {"id": "ben", "name": "Benfica", "short": "BEN", "c1": "#e83030", "c2": "#ffffff", "neon": "#ff3333", "pattern": "ring"},
        {"id": "mil", "name": "AC Milan", "short": "MIL", "c1": "#fb090b", "c2": "#000000", "neon": "#ff1122", "pattern": "stripes"},
        {"id": "fey", "name": "Feyenoord", "short": "FEY", "c1": "#ff0000", "c2": "#ffffff", "neon": "#ff2222", "pattern": "halves"},
        {"id": "psv", "name": "PSV Eindhoven", "short": "PSV", "c1": "#ff0000", "c2": "#ffffff", "neon": "#ff3344", "pattern": "stripes"},
        {"id": "clu", "name": "Club Brugge", "short": "CLU", "c1": "#002d62", "c2": "#000000", "neon": "#0077ff", "pattern": "stripes"},
        {"id": "shk", "name": "Shakhtar Donetsk", "short": "SHK", "c1": "#ff6600", "c2": "#000000", "neon": "#ff7700", "pattern": "stripes"},
        {"id": "gal", "name": "Galatasaray SK", "short": "GS", "c1": "#a90432", "c2": "#fdb913", "neon": "#ffaa00", "pattern": "halves"},
        {"id": "fen", "name": "Fenerbahçe SK", "short": "FB", "c1": "#002d72", "c2": "#fdd116", "neon": "#ffe600", "pattern": "stripes"},
        {"id": "sla", "name": "SK Slavia Prag", "short": "SLA", "c1": "#d71920", "c2": "#ffffff", "neon": "#ff2233", "pattern": "halves"},
        {"id": "por", "name": "FC Porto", "short": "POR", "c1": "#003b8e", "c2": "#ffffff", "neon": "#0066ff", "pattern": "stripes"},
        {"id": "bod", "name": "FK Bodø/Glimt", "short": "BOD", "c1": "#ffe600", "c2": "#000000", "neon": "#ffe600", "pattern": "ring"},
        {"id": "slo", "name": "Slovan Bratislava", "short": "SLO", "c1": "#009ee3", "c2": "#ffffff", "neon": "#00c3ff", "pattern": "stripes"},
        {"id": "lil", "name": "LOSC Lille", "short": "LIL", "c1": "#d12631", "c2": "#11224d", "neon": "#ff2244", "pattern": "halves"},
        {"id": "stu", "name": "VfB Stuttgart", "short": "STU", "c1": "#e30613", "c2": "#ffffff", "neon": "#ff2233", "pattern": "ring"},
        {"id": "rom", "name": "AS Roma", "short": "ROM", "c1": "#8e1f2f", "c2": "#f0bc42", "neon": "#ffbb33", "pattern": "halves"},
        {"id": "nap", "name": "SSC Napoli", "short": "NAP", "c1": "#008fd5", "c2": "#ffffff", "neon": "#00b4ff", "pattern": "ring"}
    ],
    "superlig": [
        {"id": "gs", "name": "Galatasaray SK", "short": "GS", "c1": "#a90432", "c2": "#fdb913", "neon": "#ffaa00", "pattern": "halves"},
        {"id": "fb", "name": "Fenerbahçe SK", "short": "FB", "c1": "#002d72", "c2": "#fdd116", "neon": "#ffe600", "pattern": "stripes"},
        {"id": "bjk", "name": "Beşiktaş JK", "short": "BJK", "c1": "#000000", "c2": "#ffffff", "neon": "#ffffff", "pattern": "stripes"},
        {"id": "ts", "name": "Trabzonspor", "short": "TS", "c1": "#7c1c2b", "c2": "#6bb8e7", "neon": "#6bb8e7", "pattern": "stripes"},
        {"id": "ibfk", "name": "RAMS Başakşehir", "short": "IBFK", "c1": "#ff6600", "c2": "#002b49", "neon": "#ff7700", "pattern": "halves"},
        {"id": "sam", "name": "Samsunspor", "short": "SAM", "c1": "#d3122a", "c2": "#ffffff", "neon": "#ff1e38", "pattern": "stripes"},
        {"id": "eyup", "name": "Eyüpspor", "short": "EYP", "c1": "#6b2057", "c2": "#ffd700", "neon": "#ffd700", "pattern": "halves"},
        {"id": "kas", "name": "Kasımpaşa", "short": "KAS", "c1": "#00205b", "c2": "#ffffff", "neon": "#0055ff", "pattern": "stripes"},
        {"id": "goz", "name": "Göztepe", "short": "GOZ", "c1": "#ed1c24", "c2": "#fcee21", "neon": "#ffe600", "pattern": "stripes"},
        {"id": "siv", "name": "Sivasspor", "short": "SIV", "c1": "#e30613", "c2": "#ffffff", "neon": "#ff2233", "pattern": "stripes"},
        {"id": "ant", "name": "Antalyaspor", "short": "ANT", "c1": "#e30613", "c2": "#ffffff", "neon": "#ff2233", "pattern": "stripes"},
        {"id": "ala", "name": "Alanyaspor", "short": "ALA", "c1": "#ff6600", "c2": "#008000", "neon": "#00ff66", "pattern": "stripes"},
        {"id": "riz", "name": "Çaykur Rizespor", "short": "RIZ", "c1": "#007a3d", "c2": "#0055a5", "neon": "#00ff77", "pattern": "stripes"},
        {"id": "gfk", "name": "Gaziantep FK", "short": "GFK", "c1": "#e30613", "c2": "#000000", "neon": "#ff2233", "pattern": "stripes"},
        {"id": "kay", "name": "Kayserispor", "short": "KAY", "c1": "#e30613", "c2": "#ffcc00", "neon": "#ffcc00", "pattern": "stripes"},
        {"id": "kon", "name": "Konyaspor", "short": "KON", "c1": "#008000", "c2": "#ffffff", "neon": "#00ff66", "pattern": "stripes"},
        {"id": "bodrum", "name": "Bodrum FK", "short": "BDR", "c1": "#009933", "c2": "#ffffff", "neon": "#00ff66", "pattern": "ring"},
        {"id": "hat", "name": "Hatayspor", "short": "HAT", "c1": "#800000", "c2": "#ffffff", "neon": "#ff3344", "pattern": "halves"}
    ],
    "premier": [
        {"id": "pl_mci", "name": "Manchester City", "short": "MCI", "c1": "#6cabdd", "c2": "#1c2c5b", "neon": "#00f0ff", "pattern": "halves"},
        {"id": "pl_ars", "name": "Arsenal", "short": "ARS", "c1": "#ef0107", "c2": "#ffffff", "neon": "#ff0033", "pattern": "stripes"},
        {"id": "pl_liv", "name": "Liverpool FC", "short": "LIV", "c1": "#c8102e", "c2": "#00b2a9", "neon": "#ff2b44", "pattern": "ring"},
        {"id": "pl_avl", "name": "Aston Villa", "short": "AVL", "c1": "#670e36", "c2": "#95bfe5", "neon": "#95bfe5", "pattern": "halves"},
        {"id": "pl_tot", "name": "Tottenham Hotspur", "short": "TOT", "c1": "#132257", "c2": "#ffffff", "neon": "#3366ff", "pattern": "ring"},
        {"id": "pl_che", "name": "Chelsea FC", "short": "CHE", "c1": "#034694", "c2": "#ffffff", "neon": "#0066ff", "pattern": "ring"},
        {"id": "pl_new", "name": "Newcastle United", "short": "NEW", "c1": "#000000", "c2": "#ffffff", "neon": "#ffffff", "pattern": "stripes"},
        {"id": "pl_mun", "name": "Manchester United", "short": "MUN", "c1": "#da291c", "c2": "#ffe500", "neon": "#ff2233", "pattern": "ring"},
        {"id": "pl_whu", "name": "West Ham United", "short": "WHU", "c1": "#7a263a", "c2": "#1bb1e7", "neon": "#1bb1e7", "pattern": "halves"},
        {"id": "pl_cry", "name": "Crystal Palace", "short": "CRY", "c1": "#1b458f", "c2": "#c4122e", "neon": "#ff2244", "pattern": "stripes"},
        {"id": "pl_bha", "name": "Brighton & Hove Albion", "short": "BHA", "c1": "#0057b8", "c2": "#ffffff", "neon": "#00b4ff", "pattern": "stripes"},
        {"id": "pl_bou", "name": "AFC Bournemouth", "short": "BOU", "c1": "#da291c", "c2": "#000000", "neon": "#ff2233", "pattern": "stripes"},
        {"id": "pl_ful", "name": "Fulham FC", "short": "FUL", "c1": "#ffffff", "c2": "#000000", "neon": "#ffffff", "pattern": "halves"},
        {"id": "pl_wol", "name": "Wolverhampton Wanderers", "short": "WOL", "c1": "#fdb913", "c2": "#231f20", "neon": "#ffbb00", "pattern": "ring"},
        {"id": "pl_eve", "name": "Everton FC", "short": "EVE", "c1": "#003399", "c2": "#ffffff", "neon": "#0066ff", "pattern": "ring"},
        {"id": "pl_bre", "name": "Brentford FC", "short": "BRE", "c1": "#e30613", "c2": "#ffffff", "neon": "#ff2233", "pattern": "stripes"},
        {"id": "pl_nfo", "name": "Nottingham Forest", "short": "NFO", "c1": "#dd0000", "c2": "#ffffff", "neon": "#ff2233", "pattern": "ring"},
        {"id": "pl_lei", "name": "Leicester City", "short": "LEI", "c1": "#003090", "c2": "#fdbe11", "neon": "#0077ff", "pattern": "ring"},
        {"id": "pl_sou", "name": "Southampton FC", "short": "SOU", "c1": "#d71920", "c2": "#ffffff", "neon": "#ff2233", "pattern": "stripes"},
        {"id": "pl_ips", "name": "Ipswich Town", "short": "IPS", "c1": "#0000ff", "c2": "#ffffff", "neon": "#3366ff", "pattern": "stripes"}
    ],
    "laliga": [
        {"id": "ll_rma", "name": "Real Madrid", "short": "RMA", "c1": "#ffffff", "c2": "#ffd700", "neon": "#ffd700", "pattern": "diagonal"},
        {"id": "ll_bar", "name": "FC Barcelona", "short": "BAR", "c1": "#a50044", "c2": "#004d98", "neon": "#ff0055", "pattern": "stripes"},
        {"id": "ll_atm", "name": "Atlético Madrid", "short": "ATM", "c1": "#cb3524", "c2": "#ffffff", "neon": "#ff3838", "pattern": "stripes"},
        {"id": "ll_ath", "name": "Athletic Club Bilbao", "short": "ATH", "c1": "#ee2524", "c2": "#ffffff", "neon": "#ff2233", "pattern": "stripes"},
        {"id": "ll_rso", "name": "Real Sociedad", "short": "RSO", "c1": "#0067b1", "c2": "#ffffff", "neon": "#0099ff", "pattern": "stripes"},
        {"id": "ll_bet", "name": "Real Betis", "short": "BET", "c1": "#00954c", "c2": "#ffffff", "neon": "#00ff77", "pattern": "stripes"},
        {"id": "ll_vil", "name": "Villarreal CF", "short": "VIL", "c1": "#ffe600", "c2": "#004797", "neon": "#ffe600", "pattern": "ring"},
        {"id": "ll_val", "name": "Valencia CF", "short": "VAL", "c1": "#ffffff", "c2": "#f37321", "neon": "#ff8800", "pattern": "diagonal"},
        {"id": "ll_sev", "name": "Sevilla FC", "short": "SEV", "c1": "#ffffff", "c2": "#d4001f", "neon": "#ff2244", "pattern": "diagonal"},
        {"id": "ll_osa", "name": "CA Osasuna", "short": "OSA", "c1": "#d71920", "c2": "#001e62", "neon": "#ff2233", "pattern": "halves"},
        {"id": "ll_get", "name": "Getafe CF", "short": "GET", "c1": "#0055a5", "c2": "#ffffff", "neon": "#0077ff", "pattern": "ring"},
        {"id": "ll_cel", "name": "Celta de Vigo", "short": "CEL", "c1": "#8ac3ee", "c2": "#ffffff", "neon": "#8ac3ee", "pattern": "ring"},
        {"id": "ll_mal", "name": "RCD Mallorca", "short": "MAL", "c1": "#e20613", "c2": "#000000", "neon": "#ff2233", "pattern": "ring"},
        {"id": "ll_ray", "name": "Rayo Vallecano", "short": "RAY", "c1": "#ffffff", "c2": "#e20613", "neon": "#ff2233", "pattern": "diagonal"},
        {"id": "ll_lpa", "name": "UD Las Palmas", "short": "LPA", "c1": "#ffd700", "c2": "#0055a5", "neon": "#ffd700", "pattern": "halves"},
        {"id": "ll_ala", "name": "Deportivo Alavés", "short": "ALA", "c1": "#0055a5", "c2": "#ffffff", "neon": "#0077ff", "pattern": "stripes"},
        {"id": "ll_esp", "name": "RCD Espanyol", "short": "ESP", "c1": "#007ac2", "c2": "#ffffff", "neon": "#0099ff", "pattern": "stripes"},
        {"id": "ll_leg", "name": "CD Leganés", "short": "LEG", "c1": "#0055a5", "c2": "#ffffff", "neon": "#0088ff", "pattern": "stripes"},
        {"id": "ll_vll", "name": "Real Valladolid", "short": "VLL", "c1": "#6f2c91", "c2": "#ffffff", "neon": "#c744ff", "pattern": "stripes"},
        {"id": "ll_gir", "name": "Girona FC", "short": "GIR", "c1": "#cd182a", "c2": "#ffffff", "neon": "#ff2244", "pattern": "stripes"}
    ],
    "ligue1": [
        {"id": "l1_psg", "name": "Paris Saint-Germain", "short": "PSG", "c1": "#004170", "c2": "#da291c", "neon": "#00d4ff", "pattern": "stripes"},
        {"id": "l1_mon", "name": "AS Monaco", "short": "ASM", "c1": "#e20613", "c2": "#ffffff", "neon": "#ff2233", "pattern": "diagonal"},
        {"id": "l1_bre", "name": "Stade Brestois 29", "short": "SB29", "c1": "#e20613", "c2": "#ffffff", "neon": "#ff2233", "pattern": "halves"},
        {"id": "l1_lil", "name": "LOSC Lille", "short": "LIL", "c1": "#d12631", "c2": "#11224d", "neon": "#ff2244", "pattern": "halves"},
        {"id": "l1_nic", "name": "OGC Nice", "short": "NIC", "c1": "#000000", "c2": "#e20613", "neon": "#ff2233", "pattern": "stripes"},
        {"id": "l1_ol", "name": "Olympique Lyonnais", "short": "OL", "c1": "#ffffff", "c2": "#002b49", "neon": "#0077ff", "pattern": "cross"},
        {"id": "l1_len", "name": "RC Lens", "short": "RCL", "c1": "#ffcc00", "c2": "#cc0000", "neon": "#ffcc00", "pattern": "stripes"},
        {"id": "l1_om", "name": "Olympique de Marseille", "short": "OM", "c1": "#ffffff", "c2": "#00a2e8", "neon": "#00d4ff", "pattern": "ring"},
        {"id": "l1_rei", "name": "Stade de Reims", "short": "SDR", "c1": "#e20613", "c2": "#ffffff", "neon": "#ff2233", "pattern": "ring"},
        {"id": "l1_ren", "name": "Stade Rennais", "short": "SRFC", "c1": "#e20613", "c2": "#000000", "neon": "#ff2233", "pattern": "stripes"},
        {"id": "l1_tou", "name": "Toulouse FC", "short": "TFC", "c1": "#592382", "c2": "#ffffff", "neon": "#b84dff", "pattern": "ring"},
        {"id": "l1_mpl", "name": "Montpellier HSC", "short": "MHSC", "c1": "#002b49", "c2": "#ff6600", "neon": "#ff7700", "pattern": "halves"},
        {"id": "l1_str", "name": "RC Strasbourg", "short": "RCSA", "c1": "#0055a5", "c2": "#ffffff", "neon": "#0088ff", "pattern": "diagonal"},
        {"id": "l1_nan", "name": "FC Nantes", "short": "FCN", "c1": "#ffe600", "c2": "#008000", "neon": "#ffe600", "pattern": "stripes"},
        {"id": "l1_hac", "name": "Le Havre AC", "short": "HAC", "c1": "#8ac3ee", "c2": "#002b49", "neon": "#8ac3ee", "pattern": "halves"},
        {"id": "l1_aux", "name": "AJ Auxerre", "short": "AJA", "c1": "#ffffff", "c2": "#0055a5", "neon": "#0099ff", "pattern": "ring"},
        {"id": "l1_ang", "name": "Angers SCO", "short": "SCO", "c1": "#000000", "c2": "#ffffff", "neon": "#ffffff", "pattern": "stripes"},
        {"id": "l1_ste", "name": "AS Saint-Étienne", "short": "ASSE", "c1": "#008000", "c2": "#ffffff", "neon": "#00ff66", "pattern": "stripes"}
    ],
    "extra": [
        {"id": "ext_como", "name": "Como 1907", "short": "COM", "c1": "#002d62", "c2": "#ffffff", "neon": "#0088ff", "pattern": "halves"},
        {"id": "ext_aek", "name": "AEK Atina", "short": "AEK", "c1": "#ffd700", "c2": "#000000", "neon": "#ffd700", "pattern": "stripes"},
        {"id": "ext_sab", "name": "Sabah FK", "short": "SAB", "c1": "#e20613", "c2": "#000000", "neon": "#ff2233", "pattern": "halves"},
        {"id": "ext_las", "name": "LASK Linz", "short": "LASK", "c1": "#000000", "c2": "#ffffff", "neon": "#ffffff", "pattern": "stripes"},
        {"id": "ext_vik", "name": "Viking FK", "short": "VIK", "c1": "#002d62", "c2": "#ffffff", "neon": "#0088ff", "pattern": "ring"}
    ]
}

# Load extracted logos to map
docx_logos_dir = r"C:\Users\Hakan\.gemini\antigravity\scratch\neon-futbol-simulator\assets\docx_logos"
extracted_map = {}
if os.path.exists(os.path.join(docx_logos_dir, 'teams_extracted.json')):
    with open(os.path.join(docx_logos_dir, 'teams_extracted.json'), 'r', encoding='utf-8') as f:
        for item in json.load(f):
            extracted_map[item['name'].lower()] = item['image']

all_teams = []
for league_id, teams in teams_by_league.items():
    for t in teams:
        t['league'] = league_id
        # Check matching extracted logo if any
        found_img = None
        for k, v in extracted_map.items():
            if t['name'].lower() in k or k in t['name'].lower() or t['short'].lower() in k:
                found_img = v
                break
        t['docx_logo'] = found_img
        all_teams.append(t)

output_js = r"C:\Users\Hakan\.gemini\antigravity\scratch\neon-futbol-simulator\js\teamsData.js"

with open(output_js, 'w', encoding='utf-8') as f:
    f.write("""// League definitions and comprehensive team data with exact colors, logos, and league mappings
export const LEAGUES = [
  { id: 'ucl', name: 'Şampiyonlar Ligi 26-27', icon: '🏆', count: 32, badgeColor: '#001438' },
  { id: 'superlig', name: 'Trendyol Süper Lig', icon: '🇹🇷', count: 18, badgeColor: '#e30613' },
  { id: 'premier', name: 'Premier Lig', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', count: 20, badgeColor: '#38003c' },
  { id: 'laliga', name: 'İspanya La Liga', icon: '🇪🇸', count: 20, badgeColor: '#ff2b44' },
  { id: 'ligue1', name: 'Fransa Ligue 1', icon: '🇫🇷', count: 18, badgeColor: '#091c3e' },
  { id: 'extra', name: 'Özel / Diğer Kulüpler', icon: '⭐', count: 5, badgeColor: '#202030' }
];

export function createTeamBadgeSvg(name, short, c1, c2, neon, pattern = 'stripes') {
  let innerPattern = '';
  if (pattern === 'stripes') {
    innerPattern = `<rect x="0" y="0" width="100" height="100" fill="${c1}"/>
      <rect x="25" y="0" width="25" height="100" fill="${c2}"/>
      <rect x="75" y="0" width="25" height="100" fill="${c2}"/>`;
  } else if (pattern === 'halves') {
    innerPattern = `<rect x="0" y="0" width="50" height="100" fill="${c1}"/>
      <rect x="50" y="0" width="50" height="100" fill="${c2}"/>`;
  } else if (pattern === 'cross') {
    innerPattern = `<rect x="0" y="0" width="100" height="100" fill="${c1}"/>
      <rect x="42" y="0" width="16" height="100" fill="${c2}"/>
      <rect x="0" y="42" width="100" height="16" fill="${c2}"/>`;
  } else if (pattern === 'diagonal') {
    innerPattern = `<rect x="0" y="0" width="100" height="100" fill="${c1}"/>
      <polygon points="0,100 100,0 100,20 20,100" fill="${c2}"/>`;
  } else {
    innerPattern = `<circle cx="50" cy="50" r="50" fill="${c1}"/>
      <circle cx="50" cy="50" r="38" fill="${c2}"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <clipPath id="circleClip_${short}">
      <circle cx="50" cy="50" r="48"/>
    </clipPath>
    <radialGradient id="neonGlow_${short}" cx="50%" cy="50%" r="50%">
      <stop offset="65%" stop-color="#fff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.6"/>
    </radialGradient>
  </defs>
  <g clip-path="url(#circleClip_${short})">
    ${innerPattern}
    <circle cx="50" cy="50" r="48" fill="url(#neonGlow_${short})"/>
    <circle cx="50" cy="50" r="28" fill="#0b0f19" stroke="${neon || '#ffffff'}" stroke-width="2.5" opacity="0.95"/>
    <text x="50" y="56" fill="${neon || '#ffffff'}" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="${short.length > 3 ? '12' : '15'}" text-anchor="middle" letter-spacing="0.5">${short}</text>
  </g>
  <circle cx="50" cy="50" r="47.5" fill="none" stroke="${neon || c1}" stroke-width="3.5"/>
</svg>`.trim();

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

export const TEAMS_DATA = """)
    
    f.write(json.dumps(all_teams, ensure_ascii=False, indent=2))
    
    f.write(""";

// Attach generated high-res vector badges to all teams
export const TEAMS = TEAMS_DATA.map(team => ({
  ...team,
  badgeUrl: createTeamBadgeSvg(team.name, team.short, team.c1, team.c2, team.neon, team.pattern),
  docxLogoUrl: team.docx_logo ? `./assets/docx_logos/${team.docx_logo}` : null
}));

export function getTeamsByLeague(leagueId) {
  return TEAMS.filter(t => t.league === leagueId);
}

export function getTeamById(id) {
  return TEAMS.find(t => t.id === id) || TEAMS[0];
}
""")

print("Successfully generated teamsData.js with", len(all_teams), "teams.")
