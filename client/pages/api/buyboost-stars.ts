import { getServerSession } from "next-auth/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { authOptions } from "./auth/[...nextauth]";

// Каталог бустов/минералов с ценами в Stars
const BOOST_STARS_CATALOG: Record<string, { title: string; starsPrice: number }> = {
  'hashrate-boost-s': { title: 'Hashrate Boost S', starsPrice: 25 },
  'hashrate-boost-m': { title: 'Hashrate Boost M', starsPrice: 60 },
  'hashrate-boost-l': { title: 'Hashrate Boost L', starsPrice: 150 },
  'income-boost': { title: 'Income Boost', starsPrice: 40 },
  'mining-boost': { title: 'Mining Speed Boost', starsPrice: 100 },
  'lucky-boost': { title: 'Lucky Boost', starsPrice: 75 },
  'mineral-c': { title: 'Carbon Mineral Card', starsPrice: 15 },
  'mineral-au': { title: 'Gold Mineral Card', starsPrice: 40 },
  'mineral-as': { title: 'Arsenic Mineral Card', starsPrice: 10 },
};

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
    return res.status(400).json({ message: 'Invalid boost ID' });
  }

  const boost = BOOST_STARS_CATALOG[boostId];
  if (!boost) {
    return res.status(404).json({ message: `Boost '${boostId}' not found` });
  }

  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return res.status(500).json({ message: 'Bot token not configured' });
    }

    const telegramId = session.user.telegramId;
    const payload = `boost_${boostId}_${telegramId}_${Date.now()}`;

    // Создаём invoice через Telegram Bot API
    const invoiceRes = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: boost.title,
        description: `Purchase ${boost.title} for your mining empire`,
        payload,
        currency: 'XTR',
        prices: [{ label: boost.title, amount: boost.starsPrice }],
      }),
    });

    const invoiceData = await invoiceRes.json();

    if (!invoiceData.ok) {
      console.error('Telegram invoice error:', invoiceData);
      return res.status(500).json({ message: 'Failed to create Stars invoice', detail: invoiceData.description });
    }

    return res.status(200).json({
      success: true,
      invoiceUrl: invoiceData.result,
      boostId,
      starsPrice: boost.starsPrice,
    });
  } catch (error) {
    console.error('buyboost-stars error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
