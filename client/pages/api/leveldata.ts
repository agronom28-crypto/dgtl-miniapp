import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

// Mock level data for when backend is unavailable
const mockLevels = [
  { name: 'Level 1', badges: [], backgroundUrl: '', order: 1, availability: true },
  { name: 'Level 2', badges: [], backgroundUrl: '', order: 2, availability: true },
  { name: 'Level 3', badges: [], backgroundUrl: '', order: 3, availability: true },
  { name: 'Level 4', badges: [], backgroundUrl: '', order: 4, availability: false },
  { name: 'Level 5', badges: [], backgroundUrl: '', order: 5, availability: false },
  { name: 'Level 6', badges: [], backgroundUrl: '', order: 6, availability: false },
  { name: 'Level 7', badges: [], backgroundUrl: '', order: 7, availability: false },
  { name: 'Level 8', badges: [], backgroundUrl: '', order: 8, availability: false },
  { name: 'Level 9', badges: [], backgroundUrl: '', order: 9, availability: false },
  { name: 'Level 10', badges: [], backgroundUrl: '', order: 10, availability: false },
  { name: 'Level 11', badges: [], backgroundUrl: '', order: 11, availability: false },
  { name: 'Level 12', badges: [], backgroundUrl: '', order: 12, availability: false },
  { name: 'Level 13', badges: [], backgroundUrl: '', order: 13, availability: false },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check SERVER_URL
    const serverUrl = process.env.SERVER_URL;
    if (!serverUrl) {
      console.warn('SERVER_URL is not defined, returning mock data');
      return res.status(200).json(mockLevels);
    }

    // Try fetching from backend
    const response = await axios.get(`${serverUrl}/api/levels`);

    if (!response.data) {
      return res.status(200).json(mockLevels);
    }

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching levels:', error);
    // Return mock data as fallback
    return res.status(200).json(mockLevels);
  }
}
