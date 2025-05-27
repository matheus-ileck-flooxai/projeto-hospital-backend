const express = require('express');
const jwt = require('./jwt')
const usersRouter = require('../api/user/userRouter');
const hospitalRounter = require('../api/hospital/hospitalRouter')
const vacancyRouter = require('../api/vacancy/vacancyRouter')
const applicationRouter = require('../api/application/applicationRouter')
const volunterRouter = require('../api/volunteer/volunterRouter')

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


module.exports = function (server) {
  const router = express.Router();


  server.use('/api', router);



 
  router.post('/hospital/register', async (req, res) => {
    try {

      const { name, address, email, password, phone_number } = req.body

      
      const hospital = await prisma.hospital.findUnique({
        where: { owner_email: email }
      });

      if (hospital) {
        return res.status(400).json({ error: 'Email indisponivel' })
      }

        const newHospital = await prisma.hospital.create({
        data: {
          name,
          address,
          owner_email: email
        }
      })

      
      const user = await prisma.user.create({
              data: {
                name,
                email,
                password,
                age: new Date(),
                role: 'Admin',
                score: 0,
                phone_number,
                hospitalId: newHospital.id

              }
            })


      res.status(201).json({ newHospital, user });

    } catch (error) {
      


      res.status(500).json({ error });
    }
  });

  //login usuario
  router.post('/user/login', async (req, res) => {
    const jwt = require('jsonwebtoken')

    const { email, password } = req.body;

    try {

      const user = await prisma.user.findUnique({
        where: { email }
      });


      if (!user || user.password !== password || user.role !== 'Admin')
        return res.status(401).json({ error: 'Dados incorretos' });

      const token = jwt.sign(

        { hospitalId: user.hospitalId, userid: user.id, name: user.name }, process.env.JWT_TOKEN, { expiresIn: '2hr' })



      return res.json({ token });

    } catch (error) {


      res.status(500).json({ error });
    }
  });



router.get('/vacancies', async (req, res) => {
  try {

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
   
    });
    res.json(vacancies);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao encontrar vagas' });
  }
});

  router.use('/volunteers', volunterRouter)
  //rota de usuarios
  router.use('/users', jwt, usersRouter);

  //rota de hospitais
  router.use('/hospital', jwt, hospitalRounter);

  //rota de vagas
  router.use('/vacancies', jwt, vacancyRouter)

  //rota de pedidos
  router.use('/applications', jwt, applicationRouter)

};
