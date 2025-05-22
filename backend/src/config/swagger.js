const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Api',
    description: 'Description'
  },
  host: 'projeto-hospital-backend-production.up.railway.app',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Digite o token no formato: Bearer '
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};


const outputFile = './swagger-output.json';

const routes = ['./src/config/routes.js']; 



swaggerAutogen(outputFile, routes, doc);
