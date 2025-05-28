const express = require('express');
const router = express.Router();
const prisma = require('../../config/prisma');


router.get('/', async (req, res) => {
  try {

    const vacancies = await prisma.vacancy.findMany({
    });

    if (vacancies == null) {
      res.status(404).json({ error: 'Nenhum voluntario encontrado' })
    }

    res.json(vacancies);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao encontrar voluntario' });
  }
});

router.get('/:id', async (req, res) => {
  try {

    userId = req.user.userid
    
    const user = await prisma.user.findFirst({
      where: {
        id: +userId
      }

    });

    if (user == null) {
      res.status(404).json({ error: 'Nenhum voluntario encontrado' })
    }

    res.status(200).json(user);
  } catch (error) {
    
    res.status(500).json({ error: 'Erro ao encontrar voluntario' });
  }
});



router.post('/newapplication', async (req, res) => {

  try {
  const { userId, vacancyId } = req.body


    const application = await prisma.application.create({
      data: {
        userId: +userId,
        vacancyId: +vacancyId,
        status: "Pending"
      }
    })
  

    res.status(201).json({ message: 'Pedido enviado com sucesso', application })


  }
  catch (error) {
    
    res.status(500).json({ error: 'Erro ao se cadastrar na vaga' });
  }
})


module.exports = router;
