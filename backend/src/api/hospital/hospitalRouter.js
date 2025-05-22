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



module.exports = router;
