// pages/api/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { db } from "@/lib/db";
import { getChat } from '@/lib/chatHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await getChat(req, res);
}
