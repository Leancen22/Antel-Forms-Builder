// src/pages/api/getFormById.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    try {
      const form = await prisma.form.findUnique({
        where: { id },
      });
      
      if (form) {
        // Parsear los componentes del JSON a un array
        form.components = JSON.parse(form.components);
        res.status(200).json(form);
      } else {
        res.status(404).json({ error: 'Form not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching form' });
    }
  }
}
