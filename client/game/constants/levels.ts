import { MineralInfo, MINERALS } from "./minerals";

export interface LevelConfig {
  id: number;
  name: string;
  nameEn?: string;
  nameEn?: string;
  background: string;
  backgroundImage: string;
  backgroundVideo?: string;
  minerals: string[];
  spawnInterval: number;
  minSpeed: number;
  maxSpeed: number;
  duration: number;
  special?: string;
  specialEn?: string;
  specialEn?: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// Video backgrounds from /images/background/
const VIDEOS = [
  "/images/background/back.mp4",
  "/images/background/back1.mp4",
  "/images/background/back2.mp4",
  "/images/background/back3.mp4",
];

// Static fallback images
const LEVEL_1_BACKGROUND_IMAGE = "/game/backgrounds/level1.jpg";
const LEVEL_2_BACKGROUND_IMAGE = "/game/backgrounds/level2.jpg";

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "Базовый уровень", nameEn: "Basic Level", nameEn: "Basic Level",
    background: "#181818",
    backgroundImage: LEVEL_1_BACKGROUND_IMAGE,
    backgroundVideo: VIDEOS[0],
    minerals: ["H", "He", "Li", "Be"],
    spawnInterval: 200,
    minSpeed: 100,
    maxSpeed: 400,
    duration: 60,
    special: "Стандартная скорость и минералы.", specialEn: "Standard speed and minerals.", specialEn: "Standard speed and minerals.",
    colorScheme: { primary: "#181818", secondary: "#2a2a2a", accent: "#39ff14" }
  },
  {
    id: 2,
    name: "Щелочные металлы", nameEn: "Alkali Metals", nameEn: "Alkali Metals",
    background: "#1a1a2e",
    backgroundImage: LEVEL_2_BACKGROUND_IMAGE,
    backgroundVideo: VIDEOS[1],
    minerals: ["Li", "Na", "K", "Rb", "Cs", "Fr"],
    spawnInterval: 180,
    minSpeed: 120,
    maxSpeed: 420,
    duration: 22,
    special: "Появляются только щелочные металлы.", specialEn: "Only alkali metals appear.", specialEn: "Only alkali metals appear.",
    colorScheme: { primary: "#1a1a2e", secondary: "#2d2d4a", accent: "#ff007f" }
  },
  {
    id: 3,
    name: "Галогены и благородные газы", nameEn: "Halogens & Noble Gases", nameEn: "Halogens & Noble Gases",
    background: "#22223b",
    backgroundImage: LEVEL_1_BACKGROUND_IMAGE,
    backgroundVideo: VIDEOS[2],
    minerals: ["F", "Cl", "Br", "I", "At", "Ts", "He", "Ne", "Ar", "Kr", "Xe", "Rn", "Og"],
    spawnInterval: 170,
    minSpeed: 130,
    maxSpeed: 430,
    duration: 24,
    special: "Редкие элементы встречаются чаще.", specialEn: "Rare elements appear more often.", specialEn: "Rare elements appear more often.",
    colorScheme: { primary: "#22223b", secondary: "#3a3a5a", accent: "#00ffff" }
  },
  {
    id: 4,
    name: "Переходные металлы", nameEn: "Transition Metals", nameEn: "Transition Metals",
    background: "#2d3142",
    backgroundImage: LEVEL_2_BACKGROUND_IMAGE,
    backgroundVideo: VIDEOS[3],
    minerals: ["Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn"],
    spawnInterval: 160,
    minSpeed: 140,
    maxSpeed: 440,
    duration: 26,
    special: "Много металлов, скорость выше.", specialEn: "Many metals, higher speed.", specialEn: "Many metals, higher speed.",
    colorScheme: { primary: "#2d3142", secondary: "#4a4d6a", accent: "#ffea00" }
  },
  {
    id: 5,
    name: "Лантаноиды", nameEn: "Lanthanides", nameEn: "Lanthanides",
    background: "#3a506b",
    backgroundImage: LEVEL_1_BACKGROUND_IMAGE,
    backgroundVideo: VIDEOS[0],
    minerals: ["La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu"],
    spawnInterval: 150,
    minSpeed: 150,
    maxSpeed: 450,
    duration: 28,
    special: "Выпадают только лантаноиды.", specialEn: "Only lanthanides drop.", specialEn: "Only lanthanides drop.",
    colorScheme: { primary: "#3a506b", secondary: "#5a709b", accent: "#00ff00" }
  },
  {
    id: 6,
    name: "Актиноиды", nameEn: "Actinides", nameEn: "Actinides",
    background: "#1b263b",
    backgroundImage: LEVEL_2_BACKGROUND_IMAGE,
    backgroundVideo: VIDEOS[1],
    minerals: ["Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr"],
    spawnInterval: 140,
    minSpeed: 160,
    maxSpeed: 460,
    duration: 30,
    special: "Выпадают только актиноиды.", specialEn: "Only actinides drop.", specialEn: "Only actinides drop.",
    colorScheme: { primary: "#1b263b", secondary: "#2b365b", accent: "#ff0033" }
  },
  {
    id: 7,
    name: "Главная группа", nameEn: "Main Group", nameEn: "Main Group",
    background: "#0b132b",
    backgroundImage: LEVEL_1_BACKGROUND_IMAGE,
    backgroundVideo: VIDEOS[2],
    minerals: ["B", "C", "N", "O", "F", "Si", "P", "S", "Cl", "As", "Se", "Br", "Sb", "Te", "I", "At"],
    spawnInterval: 130,
    minSpeed: 170,
    maxSpeed: 470,
    duration: 32,
    special: "Только элементы главной группы.", specialEn: "Main group elements only.", specialEn: "Main group elements only.",
    colorScheme: { primary: "#0b132b", secondary: "#1b234b", accent: "#00c0ff" }
  },
  {
    id: 8,
    name: "Щелочноземельные металлы", nameEn: "Alkaline Earth Metals", nameEn: "Alkaline Earth Metals",
    background: "#5f4bb6",
    backgroundImage: LEVEL_2_BACKGROUND_IMAGE,
    backgroundVideo: VIDEOS[3],
    minerals: ["Be", "Mg", "Ca", "Sr", "Ba", "Ra"],
    spawnInterval: 120,
    minSpeed: 180,
    maxSpeed: 480,
    duration: 34,
    special: "Щелочноземельные металлы, высокая скорость.", specialEn: "Alkaline earth metals, high speed.", specialEn: "Alkaline earth metals, high speed.",
    colorScheme: { primary: "#5f4bb6", secondary: "#7f6bd6", accent: "#ff007f" }
  },
  {
    id: 9,
    name: "Постпереходные металлы", nameEn: "Post-Transition Metals", nameEn: "Post-Transition Metals",
    background: "#6a0572",
    backgroundImage: LEVEL_1_BACKGROUND_IMAGE,
    backgroundVideo: VIDEOS[0],
    minerals: ["Al", "Ga", "In", "Sn", "Tl", "Pb", "Bi", "Nh", "Fl", "Mc", "Lv"],
    spawnInterval: 110,
    minSpeed: 190,
    maxSpeed: 490,
    duration: 36,
    special: "Редкие постпереходные металлы.", specialEn: "Rare post-transition metals.", specialEn: "Rare post-transition metals.",
    colorScheme: { primary: "#6a0572", secondary: "#8a2592", accent: "#00ffff" }
  },
  {
    id: 10,
    name: "Смешанный уровень", nameEn: "Mixed Level", nameEn: "Mixed Level",
    background: "#ff6f3c",
    backgroundImage: LEVEL_2_BACKGROUND_IMAGE,
    backgroundVideo: VIDEOS[1],
    minerals: ["H", "O", "Na", "K", "Fe", "Cu", "Ag", "Au", "Pb", "U"],
    spawnInterval: 100,
    minSpeed: 200,
    maxSpeed: 500,
    duration: 38,
    special: "Смешанные элементы, высокая сложность.", specialEn: "Mixed elements, high difficulty.", specialEn: "Mixed elements, high difficulty.",
    colorScheme: { primary: "#ff6f3c", secondary: "#ff8f5c", accent: "#ffea00" }
  },
  {
    id: 11,
    name: "Редкоземельные элементы", nameEn: "Rare Earth Elements", nameEn: "Rare Earth Elements",
    background: "#2e294e",
    backgroundImage: LEVEL_2_BACKGROUND_IMAGE,
    backgroundVideo: VIDEOS[2],
    minerals: ["Sc", "Y", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu"],
    spawnInterval: 90,
    minSpeed: 210,
    maxSpeed: 510,
    duration: 40,
    special: "Редкоземельные элементы, максимальная скорость.", specialEn: "Rare earth elements, max speed.", specialEn: "Rare earth elements, max speed.",
    colorScheme: { primary: "#2e294e", secondary: "#4e496e", accent: "#00ff00" }
  },
  {
    id: 12,
    name: "Супер-редкие", nameEn: "Super Rare", nameEn: "Super Rare",
    background: "#ff206e",
    backgroundImage: LEVEL_2_BACKGROUND_IMAGE,
    backgroundVideo: VIDEOS[3],
    minerals: ["Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"],
    spawnInterval: 80,
    minSpeed: 220,
    maxSpeed: 520,
    duration: 42,
    special: "Выпадают только сверхтяжёлые элементы.", specialEn: "Only super-heavy elements drop.", specialEn: "Only super-heavy elements drop.",
    colorScheme: { primary: "#ff206e", secondary: "#ff408e", accent: "#ff0033" }
  },
  {
    id: 13,
    name: "Все элементы!", nameEn: "All Elements!", nameEn: "All Elements!",
    background: "#00b894",
    backgroundImage: LEVEL_2_BACKGROUND_IMAGE,
    backgroundVideo: VIDEOS[0],
    minerals: MINERALS.map(m => m.symbol),
    spawnInterval: 70,
    minSpeed: 230,
    maxSpeed: 530,
    duration: 45,
    special: "Финальный уровень: все 118 элементов!", specialEn: "Final level: all 118 elements!", specialEn: "Final level: all 118 elements!",
    colorScheme: { primary: "#00b894", secondary: "#20d8b4", accent: "#ffea00" }
  }
];
