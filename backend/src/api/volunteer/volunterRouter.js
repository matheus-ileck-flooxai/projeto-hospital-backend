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

    const userId = req.user.userid;

    const user = await prisma.user.findFirst({
      where: { id: +userId },
      include: {
        applications: {
          where: {
            status: {
              in: ['Pending', 'Approved']
            }
          },
          include: {
            vacancy: {
              include: {
                hospital: {
                  select: {
                    name: true,
                    address: true,
                  }
                }
              }
            }
          }
        }
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

router.put('/:id', async (req, res) => {
  try {
    const { name, email, age, password, phone_number, } = req.body
    const id = parseInt(req.params.id);

    const updatedUser = await prisma.user.update({
      data: {
        name,
        email,
        age,
        phone_number,
        password
      },
      where: {
        id: +id
      }
    })
    res.status(200).json({ message: 'Usuario atualizado com sucesso!', updatedUser });

  } catch (error) {

    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
})


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


router.delete('/cancelapplication/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.user.userid
    await prisma.application.deleteMany({
      where: {
        vacancyId: +id,
        userId
      }
    });


    res.status(200).json({ message: 'Solicitação removida com sucesso!' });

  } catch (error) {
    console.log(error);



    res.status(500).json({ error: 'Erro ao remover vaga' });
  }
});

module.exports = router;
