import type { NextApiRequest, NextApiResponse } from 'next';

// Proxy to Express server - avoid direct MongoDB connection in Next.js
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const response = await fetch(`${serverUrl}/api/boosts`);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch boost cards from server' });
    }
    
    const boostCards = await response.json();
    return res.status(200).json(boostCards);
  } catch (error) {
    console.error('Error fetching boost cards:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
