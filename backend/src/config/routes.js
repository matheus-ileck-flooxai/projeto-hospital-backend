const express = require('express')

module.exports = function (server) {
        //API
        const router = express.router()
        server.use('/api', router)
}