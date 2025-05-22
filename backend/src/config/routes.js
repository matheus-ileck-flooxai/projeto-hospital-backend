const express = require('express');
const jwt = require('./jwt')
const usersRouter = require('../api/user/userRouter');
const hospitalRounter = require('../api/hospital/hospitalRouter')
const authRouter = require('../api/auth/authService')
const vacancyRouter = require('../api/vacancy/vacancyRouter')

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


module.exports = function (server) {
  const router = express.Router();


  server.use('/api', router);

  


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

    const { name, address, email, password } = req.body
    
    const hospital = await prisma.hospital.findUnique({
      where: { email }
    });
    if (hospital) {
      return res.status(400).json({ error: 'Email indisponivel' })
    }

    const newHospital = await prisma.hospital.create({
      data: {
        name,
        address,
        email,
        password
      }
    })
    
    res.status(201).json({ newHospital });

  } catch (error) {
    console.log(error);


    res.status(500).json({ error });
  }
});

 

 
  //rota de usuarios
  router.use('/users', jwt, usersRouter);

  //rota de hospitais
  router.use('/hospital', jwt, hospitalRounter);

  //router.use('/login', authRouter)

  router.use('/vacancies', jwt, vacancyRouter)

};
