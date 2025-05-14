const express = require('express')

module.exports = function (server) {

    //API
    const router = express.Router()
    server.use('/api', router)




    //Hospital
    const hospitalService = require('../api/hospital/hospitalService')
    hospitalService.register(router, '/hospital')


    //User
    const userService = require('../api/user/userService')
    userService.register(router, '/user')

    //Rota pra login
    const authService = require('../api/auth/authService')
    authService(router)

}