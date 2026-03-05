const mongoose = require('mongoose');
require('dotenv').config();

const boostCards = [
  {
    id: 'pickaxe1',
    title: 'Pickaxe 1',
    description: 'Increases tap power and leaves pickaxe trail',
    price: 300,
    imageUrl: '/images/kirka1.png',
    availability: true,
    starsPrice: 100,
    type: 'tool',
    duration: 0,
    multiplier: 2
  },
  {
    id: 'boots_female',
    title: 'Female Boots',
    description: 'Protects from red stone penalty. Leaves female boot footprint.',
    price: 600,
    imageUrl: '/images/boot_female.png',
    availability: true,
    starsPrice: 200,
    type: 'boots',
    duration: 0,
    multiplier: 1
  },
  {
    id: 'boots_male',
    title: 'Male Boots',
    description: 'Protects from red stone penalty. Leaves male boot footprint.',
    price: 750,
    imageUrl: '/images/boot_male.png',
    availability: true,
    starsPrice: 250,
    type: 'boots',
    duration: 0,
    multiplier: 1
  },
  {
    id: 'boots_golden',
    title: 'Golden Foots',
    description: 'Premium protection from red stone. Golden boot footprint.',
    price: 1200,
    imageUrl: '/images/magnit_boot.png',
    availability: true,
    starsPrice: 400,
    type: 'boots',
    duration: 0,
    multiplier: 1
  },
  {
    id: 'boots_leather',
    title: 'Leather Boots',
    description: 'Best protection from red stone. Leather boot footprint.',
    price: 1500,
    imageUrl: '/images/boot_male.png',
    availability: true,
    starsPrice: 500,
    type: 'boots',
    duration: 0,
    multiplier: 1
  },
  {
    id: 'tap_power_x2',
    title: 'Tap Power x2',
    description: 'Double your tap power for 1 hour',
    price: 500,
    imageUrl: '/icons/resources/rare_metals.svg',
    availability: true,
    starsPrice: 25,
    type: 'boost',
    duration: 3600,
    multiplier: 2
  }
];

async function seedBoosts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('boosts-cards');

    // Clear existing boost cards
    await collection.deleteMany({});
    console.log('Cleared existing boost cards');

    // Insert new boost cards
    const result = await collection.insertMany(boostCards);
    console.log(`Inserted ${result.insertedCount} boost cards`);

    await mongoose.disconnect();
    console.log('Done! Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding boosts:', error);
    process.exit(1);
  }
}

seedBoosts();
