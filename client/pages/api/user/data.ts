import { getServerSession, Session } from 'next-auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../auth/[...nextauth]';

// Mock user data for when database is unavailable
const mockUserData = {
  _id: 'mock_user_001',
  telegramId: '0',
  username: 'Player',
  firstName: 'Demo',
  lastName: 'User',
  coins: 1000.00,
  energy: {
    current: 100,
    lastReplenished: new Date().toISOString()
  },
  lastLogin: new Date().toISOString(),
  collectedMinerals: {},
  boosts: {},
  lastGamePlayed: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session: Session | null = await getServerSession(req, res, authOptions);

    if (!session?.user?.telegramId) {
      // Return mock data for demo/testing when no session
      console.warn('[API /user/data] No session, returning mock user data');
      return res.status(200).json(mockUserData);
    }

    const telegramIdFromSession = session.user.telegramId;
    const telegramIdNum = parseInt(telegramIdFromSession, 10);

    if (isNaN(telegramIdNum)) {
      console.warn('[API /user/data] Invalid telegramId, returning mock data');
      return res.status(200).json(mockUserData);
    }

    // Try to connect to database and fetch real user data
    try {
      const { connectToDatabase } = await import('../../../lib/mongodb');
      const UserModel = (await import('../../../models/User')).default;
      const mongoose = await import('mongoose');

      await connectToDatabase();

      const userDocument = await UserModel.findOne({ telegramId: telegramIdNum }).lean();

      if (!userDocument) {
        // User not found in DB - return mock with session info
        return res.status(200).json({
          ...mockUserData,
          telegramId: telegramIdFromSession,
          username: session.user.name || 'Player',
          firstName: session.user.name || 'Player'
        });
      }

      return res.status(200).json(userDocument);
    } catch (dbError) {
      console.error('[API /user/data] Database error, returning mock data:', dbError);
      // Return mock data with session info when DB is unavailable
      return res.status(200).json({
        ...mockUserData,
        telegramId: telegramIdFromSession,
        username: session.user.name || 'Player',
        firstName: session.user.name || 'Player'
      });
    }
  } catch (error) {
    console.error('[API /user/data] Error:', error);
    // Ultimate fallback - return mock data
    return res.status(200).json(mockUserData);
  }
}
