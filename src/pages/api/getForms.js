// src/pages/api/getForms.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const forms = await prisma.form.findMany();
      res.status(200).json(forms);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching forms' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
