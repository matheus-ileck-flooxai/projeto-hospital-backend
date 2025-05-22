const port = 3306
const express = require("express")
const server = express()
const allowCors = require('./cors')
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(allowCors)


server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));


server.listen(port, function () {
    (`Backend is running on port ${port}`);

})

module.exports = server