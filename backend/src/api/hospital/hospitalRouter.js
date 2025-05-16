const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const hospital = await prisma.hospital.findMany();
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao encontrar hospitais' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, address, email, password } = req.body
    const newHospital = await prisma.hospital.create({
      data: {
        name,
        email,
        address,
        password
      },
    });
    res.status(201).json(newHospital)

  }
  catch (error) {

    res.status(500).json({ erro: 'Erro ao salvar dados' })
  }
})

router.get('/volunteers', async (req, res) => {
  try {
    const volunteers = await prisma.user.findMany({
      where: {
        applications: {
          some: {
            status: 'Approved'
          }
        }
      }
    });
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao encontrar voluntarios' });
  }
});


module.exports = router;
