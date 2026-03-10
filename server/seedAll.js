const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/dgtl_miniapp';

const levels = [
  {name:"Newbie",order:1,badges:[],backgroundUrl:"/game/backgrounds/level1.jpg",availability:true,requiredScore:0,requiredLevel:0},
  {name:"Miner",order:2,badges:["first_mine"],backgroundUrl:"/game/backgrounds/level2.jpg",availability:true,requiredScore:1000,requiredLevel:1},
  {name:"Pro Miner",order:3,badges:["pro_mine","speed"],backgroundUrl:"",availability:true,requiredScore:5000,requiredLevel:2},
  {name:"Expert",order:4,badges:["expert","multi_resource"],backgroundUrl:"",availability:true,requiredScore:15000,requiredLevel:3},
  {name:"Master",order:5,badges:["master","diamond_hands"],backgroundUrl:"",availability:true,requiredScore:50000,requiredLevel:4},
  {name:"Legend",order:6,badges:["legend","whale"],backgroundUrl:"",availability:true,requiredScore:150000,requiredLevel:5}
];

const boosts = [
  {id:"pickaxe1",title:"Pickaxe 1",description:"Increases tap power and leaves pickaxe trail",price:300,imageUrl:"/boosts/pickaxe1.png",availability:true,starsPrice:100,type:"tool",duration:0,multiplier:2},
  {id:"dynamite1",title:"Dynamite",description:"Collects all minerals on screen at once",price:500,imageUrl:"/boosts/dinamit1.png",availability:true,starsPrice:150,type:"boost",duration:0,multiplier:1},
  {id:"boots_female",title:"Female Boots",description:"Protects from red stone penalty",price:600,imageUrl:"/boosts/boots_female.png",availability:true,starsPrice:50,type:"boots",duration:0,multiplier:1},
  {id:"boots_male",title:"Male Boots",description:"Protects from red stone penalty",price:750,imageUrl:"/boosts/boots_male.png",availability:true,starsPrice:60,type:"boots",duration:0,multiplier:1},
  {id:"boots_golden",title:"Golden Foots",description:"Premium protection from red stone",price:1200,imageUrl:"/boosts/boots_golden.png",availability:true,starsPrice:100,type:"boots",duration:0,multiplier:1},
  {id:"boots_leather",title:"Leather Boots",description:"Best protection from red stone",price:1500,imageUrl:"/boosts/boots_leather.png",availability:true,starsPrice:120,type:"boots",duration:0,multiplier:1}
];

async function seedAll() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to', MONGO_URI);
    const db = mongoose.connection.db;

    // Seed levels
    await db.collection('levels').deleteMany({});
    await db.collection('levels').insertMany(levels);
    console.log('Seeded', levels.length, 'levels');

    // Seed boosts
    await db.collection('boosts-cards').deleteMany({});
    await db.collection('boosts-cards').insertMany(boosts);
    console.log('Seeded', boosts.length, 'boost cards');

    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

seedAll();
