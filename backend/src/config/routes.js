const express = require('express');
const jwt = require('./jwt')
const usersRouter = require('../api/user/userRouter');
const hospitalRounter = require ('../api/hospital/hospitalRouter')
const authRouter = require('../api/auth/authService')
const vacancyRoute = require('../api/vacancy/vacancyRoute')

module.exports = function (server) {
  const router = express.Router();


  server.use('/api', router);

  //rota de usuarios
  router.use('/users', usersRouter);

  //rota de hospitais
  router.use('/hospital',jwt, hospitalRounter);

  router.use('/login', authRouter)

  router.use('/vacancies', vacancyRoute)

};
