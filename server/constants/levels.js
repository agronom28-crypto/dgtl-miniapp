const levels = [
  {
    order: 1, name: "Newbie",
    backgroundUrl: "/game/backgrounds/level1.jpg",
    requiredScore: 0, duration: 60,
    colorScheme: { primary: "#4CAF50", secondary: "#8BC34A" },
    minerals: [
      { name: "Бром", symbol: "Br", imageSrc: "/minerals/Br.png", score: 10, frequency: 0.1 },
      { name: "Золото", symbol: "Au", imageSrc: "/minerals/Au.png", score: 100, frequency: 0.01 },
      { name: "Углерод", symbol: "C", imageSrc: "/minerals/C.png", score: 20, frequency: 0.05 },
      { name: "Железо", symbol: "Fe", imageSrc: "/minerals/Fe.png", score: 15, frequency: 0.08 },
      { name: "Кислород", symbol: "O", imageSrc: "/minerals/O.png", score: 5, frequency: 0.12 },
      { name: "Серебро", symbol: "Ag", imageSrc: "/minerals/Ag.png", score: 75, frequency: 0.02 }
    ]
  },
  {
    order: 2, name: "Miner",
    backgroundUrl: "/game/backgrounds/level2.jpg",
    requiredScore: 1000, duration: 70,
    colorScheme: { primary: "#FFC107", secondary: "#FF9800" },
    minerals: [
      { name: "Литий", symbol: "Li", imageSrc: "/minerals/Li.png", score: 20, frequency: 0.1 },
      { name: "Натрий", symbol: "Na", imageSrc: "/minerals/Na.png", score: 25, frequency: 0.08 },
      { name: "Калий", symbol: "K", imageSrc: "/minerals/K.png", score: 30, frequency: 0.07 },
      { name: "Рубидий", symbol: "Rb", imageSrc: "/minerals/Rb.png", score: 40, frequency: 0.05 },
      { name: "Цезий", symbol: "Cs", imageSrc: "/minerals/Cs.png", score: 50, frequency: 0.03 }
    ]
  },
  {
    order: 3, name: "Pro Miner",
    backgroundUrl: "", requiredScore: 5000, duration: 80,
    colorScheme: { primary: "#2196F3", secondary: "#03A9F4" },
    minerals: [
      { name: "Фтор", symbol: "F", imageSrc: "/minerals/F.png", score: 15, frequency: 0.1 },
      { name: "Хлор", symbol: "Cl", imageSrc: "/minerals/Cl.png", score: 20, frequency: 0.08 },
      { name: "Неон", symbol: "Ne", imageSrc: "/minerals/Ne.png", score: 30, frequency: 0.05 },
      { name: "Аргон", symbol: "Ar", imageSrc: "/minerals/Ar.png", score: 25, frequency: 0.06 }
    ]
  },
  {
    order: 4, name: "Expert",
    backgroundUrl: "", requiredScore: 15000, duration: 90,
    colorScheme: { primary: "#9C27B0", secondary: "#E91E63" },
    minerals: [
      { name: "Титан", symbol: "Ti", imageSrc: "/minerals/Ti.png", score: 35, frequency: 0.07 },
      { name: "Ванадий", symbol: "V", imageSrc: "/minerals/V.png", score: 40, frequency: 0.06 },
      { name: "Хром", symbol: "Cr", imageSrc: "/minerals/Cr.png", score: 45, frequency: 0.05 },
      { name: "Марганец", symbol: "Mn", imageSrc: "/minerals/Mn.png", score: 30, frequency: 0.08 }
    ]
  },
  {
    order: 5, name: "Master",
    backgroundUrl: "", requiredScore: 50000, duration: 100,
    colorScheme: { primary: "#FF5722", secondary: "#F44336" },
    minerals: [
      { name: "Платина", symbol: "Pt", imageSrc: "/minerals/Pt.png", score: 80, frequency: 0.02 },
      { name: "Ртуть", symbol: "Hg", imageSrc: "/minerals/Hg.png", score: 60, frequency: 0.04 },
      { name: "Никель", symbol: "Ni", imageSrc: "/minerals/Ni.png", score: 50, frequency: 0.05 },
      { name: "Водород", symbol: "H", imageSrc: "/minerals/H.png", score: 10, frequency: 0.12 }
    ]
  },
  {
    order: 6, name: "Legend",
    backgroundUrl: "", requiredScore: 150000, duration: 120,
    colorScheme: { primary: "#FFD700", secondary: "#FFA000" },
    minerals: [
      { name: "Уран", symbol: "U", imageSrc: "/minerals/U.png", score: 150, frequency: 0.01 },
      { name: "Гелий", symbol: "He", imageSrc: "/minerals/He.png", score: 8, frequency: 0.15 },
      { name: "Скандий", symbol: "Sc", imageSrc: "/minerals/Sc.png", score: 90, frequency: 0.03 },
      { name: "Германий", symbol: "Ge", imageSrc: "/minerals/Ge.png", score: 70, frequency: 0.04 }
    ]
  }
];

module.exports = { LEVELS: levels };
