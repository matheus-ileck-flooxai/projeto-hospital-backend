const User = require('../user/userRouter')
const express = require('express')

module.exports = function (router) {
    router.post('/login', async (req, res) => {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' })
        }


        if (password !== user.password) {
            return res.status(401).json({ error: 'Usuario não encontrado' })
        }

        return res.status(200).json({ user })

    })
}