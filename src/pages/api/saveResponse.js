// src/pages/api/saveResponse.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { formId, answers } = req.body;

    try {
      await prisma.response.create({
        data: {
          formId,
          answers: JSON.stringify(answers),
        },
      });
      res.status(200).json({ message: 'Response saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error saving response' });
    }
  }
}
