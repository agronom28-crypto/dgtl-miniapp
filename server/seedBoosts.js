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
    id: 'dynamite1',
    title: 'Dynamite',
    description: 'Collects all minerals on screen at once',
    price: 500,
    imageUrl: '/images/dinamit1.png',
    availability: true,
    starsPrice: 150,
    type: 'boost',
    duration: 0,
    multiplier: 1
  },
  {
    id: 'boots_female',
    title: 'Female Boots',
    description: 'Protects from red stone penalty. Leaves female boot footprint.',
    price: 600,
    imageUrl: '/images/boot_female.png',
    availability: true,
    starsPrice: 50,
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
    starsPrice: 60,
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
    starsPrice: 100,
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
    starsPrice: 120,
    type: 'boots',
    duration: 0,
    multiplier: 1
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
