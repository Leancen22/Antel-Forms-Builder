// src/pages/api/deleteForm.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.body;

    try {
      await prisma.form.delete({
        where: { id },
      });
      res.status(200).json({ message: 'Form deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting form' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
