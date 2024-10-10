import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, description, components } = req.body;

    try {
      const newForm = await prisma.form.create({
        data: {
          title,
          description,
          components: JSON.stringify(components),
        },
      });
      res.status(200).json(newForm);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save form' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
