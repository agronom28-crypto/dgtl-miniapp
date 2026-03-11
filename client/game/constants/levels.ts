import { MineralInfo, MINERALS } from "./minerals";

export interface LevelConfig {
  id: number;
  name: string;
  nameEn?: string;
  background: string;
  backgroundImage: string;
  backgroundVideo?: string;
  minerals: string[];
  spawnInterval: number;
  minSpeed: number;
  maxSpeed: number;
  duration: number;
  requiredGTL: number;
  special?: string;
  specialEn?: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const VIDEOS = [
  "/images/background/back.mp4",
  "/images/background/back1.mp4",
  "/images/background/back2.mp4",
  "/images/background/back3.mp4",
];

const LEVEL_1_BG = "/game/backgrounds/level1.jpg";
const LEVEL_2_BG = "/game/backgrounds/level2.jpg";

export const LEVELS: LevelConfig[] = [
  { id: 1, name: "Базовый уровень", nameEn: "Basic Level", background: "#181818", backgroundImage: LEVEL_1_BG, backgroundVideo: VIDEOS[0], minerals: ["H","He","Li","Be"], spawnInterval: 900, minSpeed: 90, maxSpeed: 140, duration: 60, requiredGTL: 0, special: "Стандартная скорость.", specialEn: "Standard speed.", colorScheme: { primary: "#181818", secondary: "#2a2a2a", accent: "#39ff14" } },
  { id: 2, name: "Щелочные металлы", nameEn: "Alkali Metals", background: "#1a1a2e", backgroundImage: LEVEL_2_BG, backgroundVideo: VIDEOS[1], minerals: ["Li","Na","K","Rb","Cs","Fr"], spawnInterval: 880, minSpeed: 120, maxSpeed: 170, duration: 80, requiredGTL: 100, special: "Только щелочные металлы.", specialEn: "Only alkali metals.", colorScheme: { primary: "#1a1a2e", secondary: "#2d2d4a", accent: "#ff007f" } },
  { id: 3, name: "Галогены и благородные газы", nameEn: "Halogens & Noble Gases", background: "#22223b", backgroundImage: LEVEL_1_BG, backgroundVideo: VIDEOS[2], minerals: ["F","Cl","Br","I","At","Ts","He","Ne","Ar","Kr","Xe","Rn","Og"], spawnInterval: 860, minSpeed: 150, maxSpeed: 210, duration: 100, requiredGTL: 250, special: "Редкие элементы чаще.", specialEn: "Rare elements more often.", colorScheme: { primary: "#22223b", secondary: "#3a3a5a", accent: "#00ffff" } },
  { id: 4, name: "Переходные металлы", nameEn: "Transition Metals", background: "#2d3142", backgroundImage: LEVEL_2_BG, backgroundVideo: VIDEOS[3], minerals: ["Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Y","Zr","Nb","Mo","Tc","Ru","Rh","Pd","Ag","Cd","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Rf","Db","Sg","Bh","Hs","Mt","Ds","Rg","Cn"], spawnInterval: 840, minSpeed: 180, maxSpeed: 240, duration: 150, requiredGTL: 450, special: "Много металлов.", specialEn: "Many metals.", colorScheme: { primary: "#2d3142", secondary: "#4a4d6a", accent: "#ffea00" } },
  { id: 5, name: "Лантаноиды", nameEn: "Lanthanides", background: "#3a506b", backgroundImage: LEVEL_1_BG, backgroundVideo: VIDEOS[0], minerals: ["La","Ce","Pr","Nd","Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu"], spawnInterval: 820, minSpeed: 210, maxSpeed: 270, duration: 200, requiredGTL: 700, special: "Выпадают только лантаноиды.", specialEn: "Only lanthanides.", colorScheme: { primary: "#3a506b", secondary: "#5a709b", accent: "#00ff00" } },
  { id: 6, name: "Актиноиды", nameEn: "Actinides", background: "#1b263b", backgroundImage: LEVEL_2_BG, backgroundVideo: VIDEOS[1], minerals: ["Ac","Th","Pa","U","Np","Pu","Am","Cm","Bk","Cf","Es","Fm","Md","No","Lr"], spawnInterval: 1100, minSpeed: 280, maxSpeed: 340, duration: 220, requiredGTL: 1000, special: "Выпадают только актиноиды.", specialEn: "Only actinides.", colorScheme: { primary: "#1b263b", secondary: "#2b365b", accent: "#ff0033" } },
  { id: 7, name: "Главная группа", nameEn: "Main Group", background: "#0b132b", backgroundImage: LEVEL_1_BG, backgroundVideo: VIDEOS[2], minerals: ["B","C","N","O","F","Si","P","S","Cl","As","Se","Br","Sb","Te","I","At"], spawnInterval: 1150, minSpeed: 320, maxSpeed: 380, duration: 230, requiredGTL: 1300, special: "Только главная группа.", specialEn: "Main group only.", colorScheme: { primary: "#0b132b", secondary: "#1b234b", accent: "#00c0ff" } },
  { id: 8, name: "Щелочноземельные металлы", nameEn: "Alkaline Earth Metals", background: "#5f4bb6", backgroundImage: LEVEL_2_BG, backgroundVideo: VIDEOS[3], minerals: ["Be","Mg","Ca","Sr","Ba","Ra"], spawnInterval: 1200, minSpeed: 360, maxSpeed: 420, duration: 240, requiredGTL: 1600, special: "Щелочноземельные металлы.", specialEn: "Alkaline earth metals.", colorScheme: { primary: "#5f4bb6", secondary: "#7f6bd6", accent: "#ff007f" } },
  { id: 9, name: "Постпереходные металлы", nameEn: "Post-Transition Metals", background: "#6a0572", backgroundImage: LEVEL_1_BG, backgroundVideo: VIDEOS[0], minerals: ["Al","Ga","In","Sn","Tl","Pb","Bi","Nh","Fl","Mc","Lv"], spawnInterval: 1250, minSpeed: 400, maxSpeed: 460, duration: 250, requiredGTL: 1900, special: "Редкие постпереходные металлы.", specialEn: "Rare post-transition metals.", colorScheme: { primary: "#6a0572", secondary: "#8a2592", accent: "#00ffff" } },
  { id: 10, name: "Смешанный уровень", nameEn: "Mixed Level", background: "#ff6f3c", backgroundImage: LEVEL_2_BG, backgroundVideo: VIDEOS[1], minerals: ["H","O","Na","K","Fe","Cu","Ag","Au","Pb","U"], spawnInterval: 1300, minSpeed: 440, maxSpeed: 520, duration: 230, requiredGTL: 2200, special: "Смешанные элементы.", specialEn: "Mixed elements.", colorScheme: { primary: "#ff6f3c", secondary: "#ff8f5c", accent: "#ffea00" } },
  { id: 11, name: "Редкоземельные элементы", nameEn: "Rare Earth Elements", background: "#2e294e", backgroundImage: LEVEL_2_BG, backgroundVideo: VIDEOS[2], minerals: ["Sc","Y","La","Ce","Pr","Nd","Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu"], spawnInterval: 1350, minSpeed: 480, maxSpeed: 560, duration: 210, requiredGTL: 2600, special: "Редкоземельные, макс. скорость.", specialEn: "Rare earth, max speed.", colorScheme: { primary: "#2e294e", secondary: "#4e496e", accent: "#00ff00" } },
  { id: 12, name: "Супер-редкие", nameEn: "Super Rare", background: "#ff206e", backgroundImage: LEVEL_2_BG, backgroundVideo: VIDEOS[3], minerals: ["Rf","Db","Sg","Bh","Hs","Mt","Ds","Rg","Cn","Nh","Fl","Mc","Lv","Ts","Og"], spawnInterval: 1400, minSpeed: 520, maxSpeed: 600, duration: 190, requiredGTL: 3000, special: "Только сверхтяжёлые элементы.", specialEn: "Super-heavy only.", colorScheme: { primary: "#ff206e", secondary: "#ff408e", accent: "#ff0033" } },
  { id: 13, name: "Все элементы!", nameEn: "All Elements!", background: "#00b894", backgroundImage: LEVEL_2_BG, backgroundVideo: VIDEOS[0], minerals: MINERALS.map(m => m.symbol), spawnInterval: 1400, minSpeed: 520, maxSpeed: 600, duration: 300, requiredGTL: 2000, special: "Финальный уровень: все 118 элементов!", specialEn: "Final: all 118 elements!", colorScheme: { primary: "#00b894", secondary: "#20d8b4", accent: "#ffea00" } },
];
