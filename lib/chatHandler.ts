// lib/chatHandler.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { db } from "@/lib/db";

export const getChat = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { receiverId, content } = req.body;

    try {
      const message = await db.message.create({
        data: {
          senderId: userId,
          receiverId,
          content,
        },
      });
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: 'Could not send message' });
    }
  } else if (req.method === 'GET') {
    const { chatUserId } = req.query;

    try {
      const messages = await db.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: String(chatUserId) },
            { senderId: String(chatUserId), receiverId: userId },
          ],
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Could not retrieve messages' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
