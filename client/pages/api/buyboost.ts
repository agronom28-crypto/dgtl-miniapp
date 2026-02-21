import { getServerSession } from "next-auth/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";

// Proxy to Express server for buying boosts with coins
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.telegramId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { boostId } = req.body;
  if (!boostId || typeof boostId !== 'string') {
    return res.status(400).json({ message: 'Invalid boost ID provided.' });
  }

  try {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    // First get the user's _id from server using telegramId
    const userRes = await fetch(`${serverUrl}/api/users/telegram/${session.user.telegramId}`);
    if (!userRes.ok) {
      return res.status(404).json({ message: 'User not found. Please try again.' });
    }
    const userData = await userRes.json();
    const userId = userData._id || userData.user?._id;

    if (!userId) {
      return res.status(404).json({ message: 'User not found. Please try again.' });
    }

    // Now call Express to buy the boost
    const buyRes = await fetch(`${serverUrl}/api/boosts/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boostId, userId }),
    });

    const data = await buyRes.json();
    return res.status(buyRes.status).json(data);
  } catch (error) {
    console.error('Error buying boost:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
