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

module.exports = router;
