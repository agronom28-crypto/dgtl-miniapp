import type { NextApiRequest, NextApiResponse } from 'next';

// Mock boost cards for when backend is unavailable
const mockBoostCards = [
  {
    _id: 'pickaxe1',
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
    _id: 'dynamite1',
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
    _id: 'boots_female',
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
    _id: 'boots_male',
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
    _id: 'boots_golden',
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
    _id: 'boots_leather',
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

// Proxy to Express server - avoid direct MongoDB connection in Next.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const response = await fetch(`${serverUrl}/api/boosts`);
    if (response.ok) {
      const data = await response.json();
      return res.status(200).json(data);
    } else {
      console.warn('Backend unavailable, using mock boost cards');
      return res.status(200).json(mockBoostCards);
    }
  } catch (error) {
    console.warn('Backend connection failed, using mock boost cards');
    return res.status(200).json(mockBoostCards);
  }
}
