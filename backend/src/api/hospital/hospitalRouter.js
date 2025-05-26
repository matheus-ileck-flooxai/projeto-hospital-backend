const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



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
router.get('/users', async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    const users = await prisma.user.findMany({
      where: { hospitalId },
      select: { id: true, name: true, email: true, phone_number: true }
    });

    
    res.status(200).json(users);
  } catch (error) {


    res.status(404).json({ error: 'Erro ao encontrar usuários' });
  }
})


router.get('/vacancies', async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;

    const vacancies = await prisma.vacancy.findMany({
      include: {
        applications: {
          where: {
            status: 'Approved'
          },
          select: {
            userId: true
          }
        }
      },
      where: {
        hospitalId

      }
    });
    res.json(vacancies);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao encontrar vagas' });
  }
})



module.exports = router;
