// src/pages/api/getResponsesByFormId.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    try {
      const responses = await prisma.response.findMany({
        where: { formId: id },
      });
      // Parsear cada respuesta para convertir 'answers' a JSON
      const parsedResponses = responses.map(response => ({
        ...response,
        answers: JSON.parse(response.answers),
      }));
      res.status(200).json(parsedResponses);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching responses' });
    }
  }
}
