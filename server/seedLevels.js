const mongoose = require('mongoose');
require('dotenv').config();

const Level = require('./models/Level');

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dgtl_miniapp';

const levels = [
  {
    name: 'Newbie',
    order: 1,
    badges: [],
    backgroundUrl: '',
    availability: true,
    requiredScore: 0,
    requiredLevel: 0
  },
  {
    name: 'Miner',
    order: 2,
    badges: ['first_mine'],
    backgroundUrl: '',
    availability: true,
    requiredScore: 1000,
    requiredLevel: 1
  },
  {
    name: 'Pro Miner',
    order: 3,
    badges: ['pro_mine', 'speed'],
    backgroundUrl: '',
    availability: true,
    requiredScore: 5000,
    requiredLevel: 2
  },
  {
    name: 'Expert',
    order: 4,
    badges: ['expert', 'multi_resource'],
    backgroundUrl: '',
    availability: true,
    requiredScore: 15000,
    requiredLevel: 3
  },
  {
    name: 'Master',
    order: 5,
    badges: ['master', 'diamond_hands'],
    backgroundUrl: '',
    availability: true,
    requiredScore: 50000,
    requiredLevel: 4
  },
  {
    name: 'Legend',
    order: 6,
    badges: ['legend', 'whale'],
    backgroundUrl: '',
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

    for (const levelData of levels) {
      const existing = await Level.findOne({ order: levelData.order });
      if (existing) {
        await Level.updateOne({ order: levelData.order }, { $set: levelData });
        updated++;
      } else {
        await Level.create(levelData);
        inserted++;
      }
    }

    console.log(`Seeding complete: ${inserted} inserted, ${updated} updated`);
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding levels:', error);
    process.exit(1);
  }
}

seed();
