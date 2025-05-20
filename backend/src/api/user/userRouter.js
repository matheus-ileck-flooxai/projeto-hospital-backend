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

router.post('/', async (req, res) => {
  try {
    const { name, email, password, age, role, score, phone_number, hospitalId } = req.body
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        age,
        role,
        score,
        phone_number,
        hospitalId
      },
    });
    res.status(201).json(newUser)

  } catch (error) {

    res.status(500).json({ error: 'Erro ao cadastrar novo usuário' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const {id} = req.params

    await prisma.user.delete({
      where:{
        id: +id
      }
    })
    res.status(200).json({ message: 'Usuario deletado com sucesso!' });

  } catch (error) {

    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
})

module.exports = router;
