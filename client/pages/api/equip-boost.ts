import type { NextApiRequest, NextApiResponse } from 'next';

// API endpoint to equip/unequip boots and pickaxe
// Proxies to Express backend, falls back to mock response
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { boostId, type } = req.body;

  if (!boostId || !type) {
    return res.status(400).json({ message: 'boostId and type are required' });
  }

  try {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const response = await fetch(`${serverUrl}/api/equip-boost`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boostId, type }),
    });

    if (response.ok) {
      const data = await response.json();
      return res.status(200).json(data);
    } else {
      // Fallback: mock success for development
      console.warn('Backend unavailable for equip, using mock response');
      return res.status(200).json({ success: true, equipped: boostId, type });
    }
  } catch (error) {
    // Fallback: mock success for development
    console.warn('Backend connection failed for equip, using mock response');
    return res.status(200).json({ success: true, equipped: boostId, type });
  }
}