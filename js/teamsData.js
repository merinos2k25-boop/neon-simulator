// League definitions and comprehensive team data with exact colors, logos, and league mappings
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

export const TEAMS_DATA = [
  {
    "id": "rma",
    "name": "Real Madrid",
    "short": "RMA",
    "c1": "#ffffff",
    "c2": "#ffd700",
    "neon": "#ffd700",
    "pattern": "diagonal",
    "league": "ucl",
    "docx_logo": "image26.png"
  },
  {
    "id": "mci",
    "name": "Manchester City",
    "short": "MCI",
    "c1": "#6cabdd",
    "c2": "#1c2c5b",
    "neon": "#00f0ff",
    "pattern": "halves",
    "league": "ucl",
    "docx_logo": "image1.png"
  },
  {
    "id": "bay",
    "name": "FC Bayern Münih",
    "short": "BAY",
    "c1": "#dc052d",
    "c2": "#0066b2",
    "neon": "#ff0040",
    "pattern": "stripes",
    "league": "ucl",
    "docx_logo": "image2.png"
  },
  {
    "id": "psg",
    "name": "Paris Saint-Germain",
    "short": "PSG",
    "c1": "#004170",
    "c2": "#da291c",
    "neon": "#00d4ff",
    "pattern": "stripes",
    "league": "ucl",
    "docx_logo": "image27.png"
  },
  {
    "id": "liv",
    "name": "Liverpool FC",
    "short": "LIV",
    "c1": "#c8102e",
    "c2": "#00b2a9",
    "neon": "#ff2b44",
    "pattern": "ring",
    "league": "ucl",
    "docx_logo": "image21.png"
  },
  {
    "id": "ars",
    "name": "Arsenal",
    "short": "ARS",
    "c1": "#ef0107",
    "c2": "#ffffff",
    "neon": "#ff0033",
    "pattern": "stripes",
    "league": "ucl",
    "docx_logo": "image19.png"
  },
  {
    "id": "bar",
    "name": "FC Barcelona",
    "short": "BAR",
    "c1": "#a50044",
    "c2": "#004d98",
    "neon": "#ff0055",
    "pattern": "stripes",
    "league": "ucl",
    "docx_logo": "image20.png"
  },
  {
    "id": "int",
    "name": "Inter Milan",
    "short": "INT",
    "c1": "#001ea0",
    "c2": "#000000",
    "neon": "#0066ff",
    "pattern": "stripes",
    "league": "ucl",
    "docx_logo": "image15.png"
  },
  {
    "id": "bvb",
    "name": "Borussia Dortmund",
    "short": "BVB",
    "c1": "#fde100",
    "c2": "#000000",
    "neon": "#ffe600",
    "pattern": "stripes",
    "league": "ucl",
    "docx_logo": "image29.png"
  },
  {
    "id": "atm",
    "name": "Atlético Madrid",
    "short": "ATM",
    "c1": "#cb3524",
    "c2": "#ffffff",
    "neon": "#ff3838",
    "pattern": "stripes",
    "league": "ucl",
    "docx_logo": "image3.png"
  },
  {
    "id": "lev",
    "name": "Bayer Leverkusen",
    "short": "B04",
    "c1": "#e32221",
    "c2": "#000000",
    "neon": "#ff1a1a",
    "pattern": "cross",
    "league": "ucl",
    "docx_logo": null
  },
  {
    "id": "juv",
    "name": "Juventus",
    "short": "JUV",
    "c1": "#000000",
    "c2": "#ffffff",
    "neon": "#ffffff",
    "pattern": "stripes",
    "league": "ucl",
    "docx_logo": null
  },
  {
    "id": "spo",
    "name": "Sporting CP",
    "short": "SCP",
    "c1": "#008057",
    "c2": "#ffffff",
    "neon": "#00ff88",
    "pattern": "stripes",
    "league": "ucl",
    "docx_logo": "image5.png"
  },
  {
    "id": "avl",
    "name": "Aston Villa",
    "short": "AVL",
    "c1": "#670e36",
    "c2": "#95bfe5",
    "neon": "#95bfe5",
    "pattern": "halves",
    "league": "ucl",
    "docx_logo": "image22.png"
  },
  {
    "id": "rbl",
    "name": "RB Leipzig",
    "short": "RBL",
    "c1": "#ffffff",
    "c2": "#dd0741",
    "neon": "#ff2255",
    "pattern": "ring",
    "league": "ucl",
    "docx_logo": "image23.png"
  },
  {
    "id": "ata",
    "name": "Atalanta",
    "short": "ATA",
    "c1": "#1e71b8",
    "c2": "#000000",
    "neon": "#00a2ff",
    "pattern": "stripes",
    "league": "ucl",
    "docx_logo": "image6.png"
  },
  {
    "id": "ben",
    "name": "Benfica",
    "short": "BEN",
    "c1": "#e83030",
    "c2": "#ffffff",
    "neon": "#ff3333",
    "pattern": "ring",
    "league": "ucl",
    "docx_logo": null
  },
  {
    "id": "mil",
    "name": "AC Milan",
    "short": "MIL",
    "c1": "#fb090b",
    "c2": "#000000",
    "neon": "#ff1122",
    "pattern": "stripes",
    "league": "ucl",
    "docx_logo": "image15.png"
  },
  {
    "id": "fey",
    "name": "Feyenoord",
    "short": "FEY",
    "c1": "#ff0000",
    "c2": "#ffffff",
    "neon": "#ff2222",
    "pattern": "halves",
    "league": "ucl",
    "docx_logo": "image34.png"
  },
  {
    "id": "psv",
    "name": "PSV Eindhoven",
    "short": "PSV",
    "c1": "#ff0000",
    "c2": "#ffffff",
    "neon": "#ff3344",
    "pattern": "stripes",
    "league": "ucl",
    "docx_logo": "image33.png"
  },
  {
    "id": "clu",
    "name": "Club Brugge",
    "short": "CLU",
    "c1": "#002d62",
    "c2": "#000000",
    "neon": "#0077ff",
    "pattern": "stripes",
    "league": "ucl",
    "docx_logo": "image35.png"
  },
  {
    "id": "shk",
    "name": "Shakhtar Donetsk",
    "short": "SHK",
    "c1": "#ff6600",
    "c2": "#000000",
    "neon": "#ff7700",
    "pattern": "stripes",
    "league": "ucl",
    "docx_logo": "image16.png"
  },
  {
    "id": "gal",
    "name": "Galatasaray SK",
    "short": "GS",
    "c1": "#a90432",
    "c2": "#fdb913",
    "neon": "#ffaa00",
    "pattern": "halves",
    "league": "ucl",
    "docx_logo": "image6.png"
  },
  {
    "id": "fen",
    "name": "Fenerbahçe SK",
    "short": "FB",
    "c1": "#002d72",
    "c2": "#fdd116",
    "neon": "#ffe600",
    "pattern": "stripes",
    "league": "ucl",
    "docx_logo": "image8.png"
  },
  {
    "id": "sla",
    "name": "SK Slavia Prag",
    "short": "SLA",
    "c1": "#d71920",
    "c2": "#ffffff",
    "neon": "#ff2233",
    "pattern": "halves",
    "league": "ucl",
    "docx_logo": "image18.png"
  },
  {
    "id": "por",
    "name": "FC Porto",
    "short": "POR",
    "c1": "#003b8e",
    "c2": "#ffffff",
    "neon": "#0066ff",
    "pattern": "stripes",
    "league": "ucl",
    "docx_logo": "image5.png"
  },
  {
    "id": "bod",
    "name": "FK Bodø/Glimt",
    "short": "BOD",
    "c1": "#ffe600",
    "c2": "#000000",
    "neon": "#ffe600",
    "pattern": "ring",
    "league": "ucl",
    "docx_logo": "image13.png"
  },
  {
    "id": "slo",
    "name": "Slovan Bratislava",
    "short": "SLO",
    "c1": "#009ee3",
    "c2": "#ffffff",
    "neon": "#00c3ff",
    "pattern": "stripes",
    "league": "ucl",
    "docx_logo": "image18.png"
  },
  {
    "id": "lil",
    "name": "LOSC Lille",
    "short": "LIL",
    "c1": "#d12631",
    "c2": "#11224d",
    "neon": "#ff2244",
    "pattern": "halves",
    "league": "ucl",
    "docx_logo": "image10.png"
  },
  {
    "id": "stu",
    "name": "VfB Stuttgart",
    "short": "STU",
    "c1": "#e30613",
    "c2": "#ffffff",
    "neon": "#ff2233",
    "pattern": "ring",
    "league": "ucl",
    "docx_logo": "image32.png"
  },
  {
    "id": "rom",
    "name": "AS Roma",
    "short": "ROM",
    "c1": "#8e1f2f",
    "c2": "#f0bc42",
    "neon": "#ffbb33",
    "pattern": "halves",
    "league": "ucl",
    "docx_logo": "image30.png"
  },
  {
    "id": "nap",
    "name": "SSC Napoli",
    "short": "NAP",
    "c1": "#008fd5",
    "c2": "#ffffff",
    "neon": "#00b4ff",
    "pattern": "ring",
    "league": "ucl",
    "docx_logo": "image31.png"
  },
  {
    "id": "gs",
    "name": "Galatasaray SK",
    "short": "GS",
    "c1": "#a90432",
    "c2": "#fdb913",
    "neon": "#ffaa00",
    "pattern": "halves",
    "league": "superlig",
    "docx_logo": "image6.png"
  },
  {
    "id": "fb",
    "name": "Fenerbahçe SK",
    "short": "FB",
    "c1": "#002d72",
    "c2": "#fdd116",
    "neon": "#ffe600",
    "pattern": "stripes",
    "league": "superlig",
    "docx_logo": "image8.png"
  },
  {
    "id": "bjk",
    "name": "Beşiktaş JK",
    "short": "BJK",
    "c1": "#000000",
    "c2": "#ffffff",
    "neon": "#ffffff",
    "pattern": "stripes",
    "league": "superlig",
    "docx_logo": null
  },
  {
    "id": "ts",
    "name": "Trabzonspor",
    "short": "TS",
    "c1": "#7c1c2b",
    "c2": "#6bb8e7",
    "neon": "#6bb8e7",
    "pattern": "stripes",
    "league": "superlig",
    "docx_logo": "image16.png"
  },
  {
    "id": "ibfk",
    "name": "RAMS Başakşehir",
    "short": "IBFK",
    "c1": "#ff6600",
    "c2": "#002b49",
    "neon": "#ff7700",
    "pattern": "halves",
    "league": "superlig",
    "docx_logo": null
  },
  {
    "id": "sam",
    "name": "Samsunspor",
    "short": "SAM",
    "c1": "#d3122a",
    "c2": "#ffffff",
    "neon": "#ff1e38",
    "pattern": "stripes",
    "league": "superlig",
    "docx_logo": null
  },
  {
    "id": "eyup",
    "name": "Eyüpspor",
    "short": "EYP",
    "c1": "#6b2057",
    "c2": "#ffd700",
    "neon": "#ffd700",
    "pattern": "halves",
    "league": "superlig",
    "docx_logo": null
  },
  {
    "id": "kas",
    "name": "Kasımpaşa",
    "short": "KAS",
    "c1": "#00205b",
    "c2": "#ffffff",
    "neon": "#0055ff",
    "pattern": "stripes",
    "league": "superlig",
    "docx_logo": null
  },
  {
    "id": "goz",
    "name": "Göztepe",
    "short": "GOZ",
    "c1": "#ed1c24",
    "c2": "#fcee21",
    "neon": "#ffe600",
    "pattern": "stripes",
    "league": "superlig",
    "docx_logo": null
  },
  {
    "id": "siv",
    "name": "Sivasspor",
    "short": "SIV",
    "c1": "#e30613",
    "c2": "#ffffff",
    "neon": "#ff2233",
    "pattern": "stripes",
    "league": "superlig",
    "docx_logo": null
  },
  {
    "id": "ant",
    "name": "Antalyaspor",
    "short": "ANT",
    "c1": "#e30613",
    "c2": "#ffffff",
    "neon": "#ff2233",
    "pattern": "stripes",
    "league": "superlig",
    "docx_logo": null
  },
  {
    "id": "ala",
    "name": "Alanyaspor",
    "short": "ALA",
    "c1": "#ff6600",
    "c2": "#008000",
    "neon": "#00ff66",
    "pattern": "stripes",
    "league": "superlig",
    "docx_logo": "image6.png"
  },
  {
    "id": "riz",
    "name": "Çaykur Rizespor",
    "short": "RIZ",
    "c1": "#007a3d",
    "c2": "#0055a5",
    "neon": "#00ff77",
    "pattern": "stripes",
    "league": "superlig",
    "docx_logo": null
  },
  {
    "id": "gfk",
    "name": "Gaziantep FK",
    "short": "GFK",
    "c1": "#e30613",
    "c2": "#000000",
    "neon": "#ff2233",
    "pattern": "stripes",
    "league": "superlig",
    "docx_logo": null
  },
  {
    "id": "kay",
    "name": "Kayserispor",
    "short": "KAY",
    "c1": "#e30613",
    "c2": "#ffcc00",
    "neon": "#ffcc00",
    "pattern": "stripes",
    "league": "superlig",
    "docx_logo": null
  },
  {
    "id": "kon",
    "name": "Konyaspor",
    "short": "KON",
    "c1": "#008000",
    "c2": "#ffffff",
    "neon": "#00ff66",
    "pattern": "stripes",
    "league": "superlig",
    "docx_logo": null
  },
  {
    "id": "bodrum",
    "name": "Bodrum FK",
    "short": "BDR",
    "c1": "#009933",
    "c2": "#ffffff",
    "neon": "#00ff66",
    "pattern": "ring",
    "league": "superlig",
    "docx_logo": null
  },
  {
    "id": "hat",
    "name": "Hatayspor",
    "short": "HAT",
    "c1": "#800000",
    "c2": "#ffffff",
    "neon": "#ff3344",
    "pattern": "halves",
    "league": "superlig",
    "docx_logo": null
  },
  {
    "id": "pl_mci",
    "name": "Manchester City",
    "short": "MCI",
    "c1": "#6cabdd",
    "c2": "#1c2c5b",
    "neon": "#00f0ff",
    "pattern": "halves",
    "league": "premier",
    "docx_logo": "image1.png"
  },
  {
    "id": "pl_ars",
    "name": "Arsenal",
    "short": "ARS",
    "c1": "#ef0107",
    "c2": "#ffffff",
    "neon": "#ff0033",
    "pattern": "stripes",
    "league": "premier",
    "docx_logo": "image19.png"
  },
  {
    "id": "pl_liv",
    "name": "Liverpool FC",
    "short": "LIV",
    "c1": "#c8102e",
    "c2": "#00b2a9",
    "neon": "#ff2b44",
    "pattern": "ring",
    "league": "premier",
    "docx_logo": "image21.png"
  },
  {
    "id": "pl_avl",
    "name": "Aston Villa",
    "short": "AVL",
    "c1": "#670e36",
    "c2": "#95bfe5",
    "neon": "#95bfe5",
    "pattern": "halves",
    "league": "premier",
    "docx_logo": "image22.png"
  },
  {
    "id": "pl_tot",
    "name": "Tottenham Hotspur",
    "short": "TOT",
    "c1": "#132257",
    "c2": "#ffffff",
    "neon": "#3366ff",
    "pattern": "ring",
    "league": "premier",
    "docx_logo": null
  },
  {
    "id": "pl_che",
    "name": "Chelsea FC",
    "short": "CHE",
    "c1": "#034694",
    "c2": "#ffffff",
    "neon": "#0066ff",
    "pattern": "ring",
    "league": "premier",
    "docx_logo": "image1.png"
  },
  {
    "id": "pl_new",
    "name": "Newcastle United",
    "short": "NEW",
    "c1": "#000000",
    "c2": "#ffffff",
    "neon": "#ffffff",
    "pattern": "stripes",
    "league": "premier",
    "docx_logo": null
  },
  {
    "id": "pl_mun",
    "name": "Manchester United",
    "short": "MUN",
    "c1": "#da291c",
    "c2": "#ffe500",
    "neon": "#ff2233",
    "pattern": "ring",
    "league": "premier",
    "docx_logo": "image28.png"
  },
  {
    "id": "pl_whu",
    "name": "West Ham United",
    "short": "WHU",
    "c1": "#7a263a",
    "c2": "#1bb1e7",
    "neon": "#1bb1e7",
    "pattern": "halves",
    "league": "premier",
    "docx_logo": null
  },
  {
    "id": "pl_cry",
    "name": "Crystal Palace",
    "short": "CRY",
    "c1": "#1b458f",
    "c2": "#c4122e",
    "neon": "#ff2244",
    "pattern": "stripes",
    "league": "premier",
    "docx_logo": null
  },
  {
    "id": "pl_bha",
    "name": "Brighton & Hove Albion",
    "short": "BHA",
    "c1": "#0057b8",
    "c2": "#ffffff",
    "neon": "#00b4ff",
    "pattern": "stripes",
    "league": "premier",
    "docx_logo": null
  },
  {
    "id": "pl_bou",
    "name": "AFC Bournemouth",
    "short": "BOU",
    "c1": "#da291c",
    "c2": "#000000",
    "neon": "#ff2233",
    "pattern": "stripes",
    "league": "premier",
    "docx_logo": null
  },
  {
    "id": "pl_ful",
    "name": "Fulham FC",
    "short": "FUL",
    "c1": "#ffffff",
    "c2": "#000000",
    "neon": "#ffffff",
    "pattern": "halves",
    "league": "premier",
    "docx_logo": null
  },
  {
    "id": "pl_wol",
    "name": "Wolverhampton Wanderers",
    "short": "WOL",
    "c1": "#fdb913",
    "c2": "#231f20",
    "neon": "#ffbb00",
    "pattern": "ring",
    "league": "premier",
    "docx_logo": null
  },
  {
    "id": "pl_eve",
    "name": "Everton FC",
    "short": "EVE",
    "c1": "#003399",
    "c2": "#ffffff",
    "neon": "#0066ff",
    "pattern": "ring",
    "league": "premier",
    "docx_logo": null
  },
  {
    "id": "pl_bre",
    "name": "Brentford FC",
    "short": "BRE",
    "c1": "#e30613",
    "c2": "#ffffff",
    "neon": "#ff2233",
    "pattern": "stripes",
    "league": "premier",
    "docx_logo": null
  },
  {
    "id": "pl_nfo",
    "name": "Nottingham Forest",
    "short": "NFO",
    "c1": "#dd0000",
    "c2": "#ffffff",
    "neon": "#ff2233",
    "pattern": "ring",
    "league": "premier",
    "docx_logo": null
  },
  {
    "id": "pl_lei",
    "name": "Leicester City",
    "short": "LEI",
    "c1": "#003090",
    "c2": "#fdbe11",
    "neon": "#0077ff",
    "pattern": "ring",
    "league": "premier",
    "docx_logo": "image23.png"
  },
  {
    "id": "pl_sou",
    "name": "Southampton FC",
    "short": "SOU",
    "c1": "#d71920",
    "c2": "#ffffff",
    "neon": "#ff2233",
    "pattern": "stripes",
    "league": "premier",
    "docx_logo": null
  },
  {
    "id": "pl_ips",
    "name": "Ipswich Town",
    "short": "IPS",
    "c1": "#0000ff",
    "c2": "#ffffff",
    "neon": "#3366ff",
    "pattern": "stripes",
    "league": "premier",
    "docx_logo": null
  },
  {
    "id": "ll_rma",
    "name": "Real Madrid",
    "short": "RMA",
    "c1": "#ffffff",
    "c2": "#ffd700",
    "neon": "#ffd700",
    "pattern": "diagonal",
    "league": "laliga",
    "docx_logo": "image26.png"
  },
  {
    "id": "ll_bar",
    "name": "FC Barcelona",
    "short": "BAR",
    "c1": "#a50044",
    "c2": "#004d98",
    "neon": "#ff0055",
    "pattern": "stripes",
    "league": "laliga",
    "docx_logo": "image20.png"
  },
  {
    "id": "ll_atm",
    "name": "Atlético Madrid",
    "short": "ATM",
    "c1": "#cb3524",
    "c2": "#ffffff",
    "neon": "#ff3838",
    "pattern": "stripes",
    "league": "laliga",
    "docx_logo": "image3.png"
  },
  {
    "id": "ll_ath",
    "name": "Athletic Club Bilbao",
    "short": "ATH",
    "c1": "#ee2524",
    "c2": "#ffffff",
    "neon": "#ff2233",
    "pattern": "stripes",
    "league": "laliga",
    "docx_logo": null
  },
  {
    "id": "ll_rso",
    "name": "Real Sociedad",
    "short": "RSO",
    "c1": "#0067b1",
    "c2": "#ffffff",
    "neon": "#0099ff",
    "pattern": "stripes",
    "league": "laliga",
    "docx_logo": null
  },
  {
    "id": "ll_bet",
    "name": "Real Betis",
    "short": "BET",
    "c1": "#00954c",
    "c2": "#ffffff",
    "neon": "#00ff77",
    "pattern": "stripes",
    "league": "laliga",
    "docx_logo": "image9.png"
  },
  {
    "id": "ll_vil",
    "name": "Villarreal CF",
    "short": "VIL",
    "c1": "#ffe600",
    "c2": "#004797",
    "neon": "#ffe600",
    "pattern": "ring",
    "league": "laliga",
    "docx_logo": "image7.png"
  },
  {
    "id": "ll_val",
    "name": "Valencia CF",
    "short": "VAL",
    "c1": "#ffffff",
    "c2": "#f37321",
    "neon": "#ff8800",
    "pattern": "diagonal",
    "league": "laliga",
    "docx_logo": null
  },
  {
    "id": "ll_sev",
    "name": "Sevilla FC",
    "short": "SEV",
    "c1": "#ffffff",
    "c2": "#d4001f",
    "neon": "#ff2244",
    "pattern": "diagonal",
    "league": "laliga",
    "docx_logo": null
  },
  {
    "id": "ll_osa",
    "name": "CA Osasuna",
    "short": "OSA",
    "c1": "#d71920",
    "c2": "#001e62",
    "neon": "#ff2233",
    "pattern": "halves",
    "league": "laliga",
    "docx_logo": null
  },
  {
    "id": "ll_get",
    "name": "Getafe CF",
    "short": "GET",
    "c1": "#0055a5",
    "c2": "#ffffff",
    "neon": "#0077ff",
    "pattern": "ring",
    "league": "laliga",
    "docx_logo": null
  },
  {
    "id": "ll_cel",
    "name": "Celta de Vigo",
    "short": "CEL",
    "c1": "#8ac3ee",
    "c2": "#ffffff",
    "neon": "#8ac3ee",
    "pattern": "ring",
    "league": "laliga",
    "docx_logo": "image20.png"
  },
  {
    "id": "ll_mal",
    "name": "RCD Mallorca",
    "short": "MAL",
    "c1": "#e20613",
    "c2": "#000000",
    "neon": "#ff2233",
    "pattern": "ring",
    "league": "laliga",
    "docx_logo": null
  },
  {
    "id": "ll_ray",
    "name": "Rayo Vallecano",
    "short": "RAY",
    "c1": "#ffffff",
    "c2": "#e20613",
    "neon": "#ff2233",
    "pattern": "diagonal",
    "league": "laliga",
    "docx_logo": "image6.png"
  },
  {
    "id": "ll_lpa",
    "name": "UD Las Palmas",
    "short": "LPA",
    "c1": "#ffd700",
    "c2": "#0055a5",
    "neon": "#ffd700",
    "pattern": "halves",
    "league": "laliga",
    "docx_logo": null
  },
  {
    "id": "ll_ala",
    "name": "Deportivo Alavés",
    "short": "ALA",
    "c1": "#0055a5",
    "c2": "#ffffff",
    "neon": "#0077ff",
    "pattern": "stripes",
    "league": "laliga",
    "docx_logo": "image6.png"
  },
  {
    "id": "ll_esp",
    "name": "RCD Espanyol",
    "short": "ESP",
    "c1": "#007ac2",
    "c2": "#ffffff",
    "neon": "#0099ff",
    "pattern": "stripes",
    "league": "laliga",
    "docx_logo": null
  },
  {
    "id": "ll_leg",
    "name": "CD Leganés",
    "short": "LEG",
    "c1": "#0055a5",
    "c2": "#ffffff",
    "neon": "#0088ff",
    "pattern": "stripes",
    "league": "laliga",
    "docx_logo": null
  },
  {
    "id": "ll_vll",
    "name": "Real Valladolid",
    "short": "VLL",
    "c1": "#6f2c91",
    "c2": "#ffffff",
    "neon": "#c744ff",
    "pattern": "stripes",
    "league": "laliga",
    "docx_logo": null
  },
  {
    "id": "ll_gir",
    "name": "Girona FC",
    "short": "GIR",
    "c1": "#cd182a",
    "c2": "#ffffff",
    "neon": "#ff2244",
    "pattern": "stripes",
    "league": "laliga",
    "docx_logo": null
  },
  {
    "id": "l1_psg",
    "name": "Paris Saint-Germain",
    "short": "PSG",
    "c1": "#004170",
    "c2": "#da291c",
    "neon": "#00d4ff",
    "pattern": "stripes",
    "league": "ligue1",
    "docx_logo": "image27.png"
  },
  {
    "id": "l1_mon",
    "name": "AS Monaco",
    "short": "ASM",
    "c1": "#e20613",
    "c2": "#ffffff",
    "neon": "#ff2233",
    "pattern": "diagonal",
    "league": "ligue1",
    "docx_logo": null
  },
  {
    "id": "l1_bre",
    "name": "Stade Brestois 29",
    "short": "SB29",
    "c1": "#e20613",
    "c2": "#ffffff",
    "neon": "#ff2233",
    "pattern": "halves",
    "league": "ligue1",
    "docx_logo": null
  },
  {
    "id": "l1_lil",
    "name": "LOSC Lille",
    "short": "LIL",
    "c1": "#d12631",
    "c2": "#11224d",
    "neon": "#ff2244",
    "pattern": "halves",
    "league": "ligue1",
    "docx_logo": "image10.png"
  },
  {
    "id": "l1_nic",
    "name": "OGC Nice",
    "short": "NIC",
    "c1": "#000000",
    "c2": "#e20613",
    "neon": "#ff2233",
    "pattern": "stripes",
    "league": "ligue1",
    "docx_logo": null
  },
  {
    "id": "l1_ol",
    "name": "Olympique Lyonnais",
    "short": "OL",
    "c1": "#ffffff",
    "c2": "#002b49",
    "neon": "#0077ff",
    "pattern": "cross",
    "league": "ligue1",
    "docx_logo": "image21.png"
  },
  {
    "id": "l1_len",
    "name": "RC Lens",
    "short": "RCL",
    "c1": "#ffcc00",
    "c2": "#cc0000",
    "neon": "#ffcc00",
    "pattern": "stripes",
    "league": "ligue1",
    "docx_logo": "image11.png"
  },
  {
    "id": "l1_om",
    "name": "Olympique de Marseille",
    "short": "OM",
    "c1": "#ffffff",
    "c2": "#00a2e8",
    "neon": "#00d4ff",
    "pattern": "ring",
    "league": "ligue1",
    "docx_logo": "image4.png"
  },
  {
    "id": "l1_rei",
    "name": "Stade de Reims",
    "short": "SDR",
    "c1": "#e20613",
    "c2": "#ffffff",
    "neon": "#ff2233",
    "pattern": "ring",
    "league": "ligue1",
    "docx_logo": null
  },
  {
    "id": "l1_ren",
    "name": "Stade Rennais",
    "short": "SRFC",
    "c1": "#e20613",
    "c2": "#000000",
    "neon": "#ff2233",
    "pattern": "stripes",
    "league": "ligue1",
    "docx_logo": null
  },
  {
    "id": "l1_tou",
    "name": "Toulouse FC",
    "short": "TFC",
    "c1": "#592382",
    "c2": "#ffffff",
    "neon": "#b84dff",
    "pattern": "ring",
    "league": "ligue1",
    "docx_logo": null
  },
  {
    "id": "l1_mpl",
    "name": "Montpellier HSC",
    "short": "MHSC",
    "c1": "#002b49",
    "c2": "#ff6600",
    "neon": "#ff7700",
    "pattern": "halves",
    "league": "ligue1",
    "docx_logo": null
  },
  {
    "id": "l1_str",
    "name": "RC Strasbourg",
    "short": "RCSA",
    "c1": "#0055a5",
    "c2": "#ffffff",
    "neon": "#0088ff",
    "pattern": "diagonal",
    "league": "ligue1",
    "docx_logo": null
  },
  {
    "id": "l1_nan",
    "name": "FC Nantes",
    "short": "FCN",
    "c1": "#ffe600",
    "c2": "#008000",
    "neon": "#ffe600",
    "pattern": "stripes",
    "league": "ligue1",
    "docx_logo": null
  },
  {
    "id": "l1_hac",
    "name": "Le Havre AC",
    "short": "HAC",
    "c1": "#8ac3ee",
    "c2": "#002b49",
    "neon": "#8ac3ee",
    "pattern": "halves",
    "league": "ligue1",
    "docx_logo": null
  },
  {
    "id": "l1_aux",
    "name": "AJ Auxerre",
    "short": "AJA",
    "c1": "#ffffff",
    "c2": "#0055a5",
    "neon": "#0099ff",
    "pattern": "ring",
    "league": "ligue1",
    "docx_logo": null
  },
  {
    "id": "l1_ang",
    "name": "Angers SCO",
    "short": "SCO",
    "c1": "#000000",
    "c2": "#ffffff",
    "neon": "#ffffff",
    "pattern": "stripes",
    "league": "ligue1",
    "docx_logo": null
  },
  {
    "id": "l1_ste",
    "name": "AS Saint-Étienne",
    "short": "ASSE",
    "c1": "#008000",
    "c2": "#ffffff",
    "neon": "#00ff66",
    "pattern": "stripes",
    "league": "ligue1",
    "docx_logo": null
  },
  {
    "id": "ext_como",
    "name": "Como 1907",
    "short": "COM",
    "c1": "#002d62",
    "c2": "#ffffff",
    "neon": "#0088ff",
    "pattern": "halves",
    "league": "extra",
    "docx_logo": "image4.png"
  },
  {
    "id": "ext_aek",
    "name": "AEK Atina",
    "short": "AEK",
    "c1": "#ffd700",
    "c2": "#000000",
    "neon": "#ffd700",
    "pattern": "stripes",
    "league": "extra",
    "docx_logo": "image12.png"
  },
  {
    "id": "ext_sab",
    "name": "Sabah FK",
    "short": "SAB",
    "c1": "#e20613",
    "c2": "#000000",
    "neon": "#ff2233",
    "pattern": "halves",
    "league": "extra",
    "docx_logo": "image14.png"
  },
  {
    "id": "ext_las",
    "name": "LASK Linz",
    "short": "LASK",
    "c1": "#000000",
    "c2": "#ffffff",
    "neon": "#ffffff",
    "pattern": "stripes",
    "league": "extra",
    "docx_logo": "image17.png"
  },
  {
    "id": "ext_vik",
    "name": "Viking FK",
    "short": "VIK",
    "c1": "#002d62",
    "c2": "#ffffff",
    "neon": "#0088ff",
    "pattern": "ring",
    "league": "extra",
    "docx_logo": "image36.png"
  }
];

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
