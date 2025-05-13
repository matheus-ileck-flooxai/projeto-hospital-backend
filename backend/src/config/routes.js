const express = require('express')
const User = require('../api/user/user')
const Hospital = require('../api/hospital/hospital')


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


}