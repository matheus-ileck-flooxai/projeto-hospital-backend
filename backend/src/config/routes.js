const express = require('express');
const jwt = require('./jwt')
const usersRouter = require('../api/user/userRouter');
const hospitalRouter = require('../api/hospital/hospitalRouter')
const vacancyRouter = require('../api/vacancy/vacancyRouter')
const applicationRouter = require('../api/application/applicationRouter')
const volunterRouter = require('../api/volunteer/volunterRouter')
const prisma = require('./prisma');



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


      if (!user || user.password !== password)
        return res.status(401).json({ error: 'Dados incorretos' });

      if (user.role !== 'Admin') {
        const token = jwt.sign(

          { userid: user.id, name: user.name, role: user.role }, process.env.JWT_TOKEN, { expiresIn: '2hr' })



        return res.json({ message: 'seja muito bem vindo', token });
      }

      else {

        const token = jwt.sign(

          { hospitalId: user.hospitalId, userid: user.id, name: user.name, role: user.role }, process.env.JWT_TOKEN, { expiresIn: '2hr' })



        return res.json({ message: 'seja muito bem vindo', token });
      }


    } catch (error) {


      res.status(500).json({ error });
    }
  });
  //cadastro de usuario (voluntario)
  router.post('/user/register', async (req, res) => {
    try {

      const { name, email, password, age, role, score, phone_number } = req.body
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password,
          age: new Date(age),
          role,
          score,
          phone_number,
          
        },
      });
      res.status(201).json(newUser)

    } catch (error) {

    console.log(error);

      
      res.status(400).json({ error: 'Erro ao cadastrar novo usuário' });
    }
  });
  //vagas para voluntarios
  router.get('/vacancies', async (req, res) => {
    try {
      const { userId } = req.query;
      
      let vacancies;

      if (userId) {
        vacancies = await prisma.vacancy.findMany({
          where: {
            applications: {
              none: {
                userId: +userId
              }
            }
          },
          include: {
            applications: {
              where: { status: 'Approved' },
              select: { userId: true }
            },
             hospital:{
             
              select:{ name:true, address: true}
            }
          }
        });
        
      } else {
        vacancies = await prisma.vacancy.findMany({
          include: {
            applications: {
              where: { status: 'Approved' },
              select: { userId: true }
            },
            hospital:{
             
              select:{ name:true, address: true}
            }

          }
        });
      }

      res.json(vacancies);

    } catch (error) {
      console.error('Erro ao encontrar vagas:', error);
      res.status(500).json({ error: 'Erro ao encontrar vagas' });
    }
  });







  //rota de usuarios
  router.use('/users', jwt('Admin'), usersRouter);

  //rota de hospitais
  router.use('/hospital', jwt('Admin'), hospitalRouter);


  //rota de vagas
  router.use('/vacancies', jwt('Admin'), vacancyRouter)

  //rota de pedidos
  router.use('/applications', jwt('Admin'), applicationRouter)

  //rota de voluntarios
  router.use('/volunteer', jwt('Volunteer'), volunterRouter)

};
