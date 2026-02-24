import type { NextApiRequest, NextApiResponse } from 'next';

// Mock boost cards for when backend is unavailable
const mockBoostCards = [
  {
    _id: 'boost1',
    name: 'Tap Power x2',
    description: 'Double your tap power for 1 hour',
    price: 500,
    type: 'boost',
    duration: 3600,
    multiplier: 2,
    image: '/images/boost1.png'
  },
  {
    _id: 'boost2',
    name: 'Auto Tap',
    description: 'Automatic tapping for 30 minutes',
    price: 1000,
    type: 'boost',
    duration: 1800,
    multiplier: 1,
    image: '/images/boost2.png'
  },
  {
    _id: 'boost3',
    name: 'Energy Refill',
    description: 'Fully restore your energy',
    price: 300,
    type: 'boost',
    duration: 0,
    multiplier: 1,
    image: '/images/boost3.png'
  }
];

// Proxy to Express server - avoid direct MongoDB connection in Next.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const response = await fetch(`${serverUrl}/api/boosts`);

    if (!response.ok) {
      console.warn('Backend returned error, using mock boost cards');
      return res.status(200).json(mockBoostCards);
    }

    const boostCards = await response.json();
    return res.status(200).json(boostCards);
  } catch (error) {
    console.error('Error fetching boost cards:', error);
    // Return mock data as fallback
    return res.status(200).json(mockBoostCards);
  }
}
