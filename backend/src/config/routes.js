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



  //login hospital
  router.post('/hospital/login', async (req, res) => {
    const jwt = require('jsonwebtoken')

    const { email, password } = req.body;

    try {

      const hospital = await prisma.hospital.findUnique({
        where: { email }
      });


      if (!hospital || hospital.password !== password)
        return res.status(401).json({ error: 'Dados incorretos' });

      const token = jwt.sign(

        { hospitalId: hospital.id, name: hospital.name }, process.env.JWT_TOKEN, { expiresIn: '2hr' })



      return res.json({ token });

    } catch (error) {


      res.status(500).json({ error });
    }
  });
  router.post('/hospital/register', async (req, res) => {
    try {

      const { name, address, owner_email, password, phone_number } = req.body


      const hospital = await prisma.hospital.findUnique({
        where: { owner_email }
      });

      if (hospital) {
        return res.status(400).json({ error: 'Email indisponivel' })
      }

        const newHospital = await prisma.hospital.create({
        data: {
          name,
          address,
          owner_email
        }
      })


      const user = await prisma.user.create({
              data: {
                name,
                email: owner_email,
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
      console.log(error);
      


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
