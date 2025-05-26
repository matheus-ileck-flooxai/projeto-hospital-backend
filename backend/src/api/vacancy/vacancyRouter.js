const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


router.post('/', async (req, res) => {
  try {
    const { title, description, schedule, qtd_volunteer, score, userId = null, hospitalId } = req.body
    const newVacancy = await prisma.vacancy.create({
      data: {
        title,
        description,
        schedule,
        qtd_volunteer: parseInt(qtd_volunteer),
        score: parseInt(score),
        userId: userId,
        hospitalId: parseInt(hospitalId),

      }
    })
    res.status(201).json({ message: 'Vaga criada com sucesso', newVacancy });
  } catch (error) {



    res.status(500).json({ error: 'Erro ao criar nova vaga' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    await prisma.application.deleteMany({
      where: {
        vacancyId: +id
      }
    });

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


router.delete('/:id/conclude', async (req, res) => {
  try {
    const { id } = req.params
    const hospitalId = req.user.hospitalId;

    const vacancy = await prisma.vacancy.findUnique({
      include: {
        applications: {
          include: {
            user: true
          }
        }
      },
      where: {
        id: parseInt(id),
        hospitalId: hospitalId
      }
    });

    await prisma.$transaction([
      ...vacancy.applications.map(application =>
        prisma.user.update({
          where: { id: application.user.id },
          data: {
            score: {
              increment: vacancy.score
            }
          }
        })
      )]),

      await prisma.application.deleteMany({
        where: {
          vacancyId: vacancy.id
        }
      });

    await prisma.vacancy.delete({
      where: {
        id: +id
      },
      include: {
        applications: true
      }
    })

    res.status(200).json({ message: 'Vaga concluida com sucesso' });

  } catch (error) {



    res.status(500).json({ error: 'Erro ao remover vaga' });
  }
});

router.put('/:id', async (req, res) => {
  try {

    const { title, description, schedule, qtd_volunteer, score, userId, hospitalId } = req.body

    const { id } = req.params

    const newVacancy = await prisma.vacancy.update({
      data: {
        title,
        description,
        schedule,
        qtd_volunteer: parseInt(qtd_volunteer),
        score: parseInt(score),
        userId: parseInt(userId),
        hospitalId: parseInt(hospitalId),
      },
      where: {
        id: +id
      }
    })
    res.status(200).json({ message: 'Vaga atualizada com sucesso', newVacancy });
  } catch (error) {

    res.status(500).json({ error: 'Erro ao atualizar vaga' });
  }
});


module.exports = router;
