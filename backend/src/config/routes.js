const express = require('express');

const usersRouter = require('../api/user/userRouter');
const hospitalRounter = require ('../api/hospital/hospital')

module.exports = function (server) {
  const router = express.Router();


  server.use('/api', router);

  //rota de usuarios
  router.use('/users', usersRouter);

  //rota de hospitais
  router.use('/hospital', hospitalRounter);


};
