const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken')
const prisma = new PrismaClient();



router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
 
        const hospital = await prisma.hospital.findUnique({
            where: { email }
        });

        
        if (!hospital || hospital.password !== password)
            return res.status(401).json({ error: 'Dados incorretos' });

        const token = jwt.sign(
            
            { hospitalId: hospital.id }, process.env.JWT_TOKEN, {expiresIn: '2hr'})

        
        
        return res.json({ token });

    } catch (error) {

        
        res.status(500).json({ error});
    }
});

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const {name, address, email, password} = req.body
        const hospital = await prisma.hospital.findUnique({
            where: { email }
        });
        if(hospital){
            return res.status(400).json({error: 'Email indisponivel'})
        }

        const newHospital = await prisma.hospital.create({
            data:{
                name,
                address,
                email,
                password
            }
        })


        const token = jwt.sign(
            
            { hospitalId: hospital.id }, process.env.JWT_TOKEN, {expiresIn: '2hr'})

        
        
        return res.json({ token });

    } catch (error) {

        
        res.status(500).json({ error});
    }
});
router.get('/hospital', async (req, res) => {
  try {
    const hospital = await prisma.hospital.findMany();
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao encontrar hospitais' });
  }
});


module.exports = router;
