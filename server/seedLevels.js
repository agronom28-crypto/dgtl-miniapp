const mongoose = require('mongoose');
require('dotenv').config();

const Level = require('./models/Level');

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dgtl_miniapp';

const levels = [
  {
    name: 'Newbie',
    order: 1,
    badges: [],
    backgroundUrl: '/backgrounds/level1.png',
    availability: true,
    requiredScore: 0,
    requiredLevel: 0
  },
  {
    name: 'Miner',
    order: 2,
    badges: ['first_mine'],
    backgroundUrl: '/backgrounds/level2.png',
    availability: true,
    requiredScore: 1000,
    requiredLevel: 1
  },
  {
    name: 'Pro Miner',
    order: 3,
    badges: ['pro_mine', 'speed'],
    backgroundUrl: '/backgrounds/level3.png',
    availability: true,
    requiredScore: 5000,
    requiredLevel: 2
  },
  {
    name: 'Expert',
    order: 4,
    badges: ['expert', 'multi_resource'],
    backgroundUrl: '/backgrounds/level4.png',
    availability: true,
    requiredScore: 15000,
    requiredLevel: 3
  },
  {
    name: 'Master',
    order: 5,
    badges: ['master', 'diamond_hands'],
    backgroundUrl: '/backgrounds/level5.png',
    availability: true,
    requiredScore: 50000,
    requiredLevel: 4
  },
  {
    name: 'Legend',
    order: 6,
    badges: ['legend', 'whale'],
    backgroundUrl: '/backgrounds/level6.png',
    availability: true,
    requiredScore: 150000,
    requiredLevel: 5
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    let inserted = 0;
    let updated = 0;

    for (const level of levels) {
      const existing = await Level.findOne({ order: level.order });
      if (existing) {
        await Level.updateOne({ order: level.order }, { $set: level });
        updated++;
      } else {
        await Level.create(level);
        inserted++;
      }
    }

    console.log(`Levels seeded: ${inserted} inserted, ${updated} updated (total: ${levels.length})`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
