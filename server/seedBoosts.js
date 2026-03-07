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
