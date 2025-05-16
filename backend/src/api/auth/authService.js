const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const hospital = await prisma.hospital.findUnique({
            where: { email }
        });

        if (!hospital || hospital.password !== password)
            return res.status(401).json({ error: 'Dados incorretos' });

        return res.json({ hospital });

    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

module.exports = router;
