const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: 'Erro ao encontrar usuários' });
  }
});

router.post('/newUser', async (req, res) => {
  try {
    const {name, email, password, age, role, score, phone_number} = req.body
      const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        age,
        role,
        score,
        phone_number,
      },
    });
    res.status(201).json(newUser)
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: 'Erro ao cadastrar novo usuários' });
  }
});

module.exports = router;
