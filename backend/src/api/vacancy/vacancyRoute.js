const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const vacancies = await prisma.vacancy.findMany();
    res.json(vacancies);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao encontrar vagas' });
  }
});
router.post('/', async (req, res) => {
  try {
    const { title, description, schedule, qtd_volunteer, score, userId, hospitalId } = req.body
    const newVacancy = await prisma.vacancy.create({
      data: {
        title,
        description,
        schedule,
        qtd_volunteer: parseInt(qtd_volunteer),
        score: parseInt(score),
        userId: parseInt(userId),
        hospitalId: parseInt(hospitalId),

      }
    })
    res.json( {message: 'Vaga criada com sucesso', newVacancy});
  } catch (error) {

    res.status(500).json({ error: 'Erro ao criar nova vaga' });
  }
});

router.delete('/:id', async (req, res) => {
   try {
    const { id } = req.params

    await prisma.vacancy.delete({
      where: {
        id: +id
      }
    })
    res.status(200).json({ message: 'Vaga removida com sucesso!' });

  } catch (error) {

    res.status(500).json({ error: 'Erro ao remover vaga' });
  }
});

module.exports = router;
