/**
 * third party libraries
 */
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const cors = require('cors');
const _ = require('lodash');

/**
 * express application
 */
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });


app.set('socketio', io);
/**
 * Swagger UI Configuration
 */
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  info: {
    title: 'Welcome to DealIt!',
    version: '1.0.0',
    description: 'Endpoints to test APIs',
  },
  host: 'localhost:3000',
  basePath: '/',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['api/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

/**
 * server configuration
 */
const config = require('../config/');
const dbService = require('./services/db.service');

// environment: development, staging, testing, production
const environment = process.env.NODE_ENV;


const DB = dbService(environment, config.migrate).start();

/*
 * Socket for chat...
 */
const chat = require('./services/chat.service')(io);

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors());

// secure express app
app.use(helmet({
  dnsPrefetchControl: false,
  frameguard: false,
  ieNoOpen: false,
}));

// define static folder
app.use(express.static('public'));

// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Configure Routes
 */
require('../config/routes').set_routes(app);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.listen(config.port, () => {
  if (environment !== 'production' &&
    environment !== 'development' &&
    environment !== 'testing'
  ) {
    console.error(`NODE_ENV is set to ${environment}, but only production and development are valid.`);
    process.exit(1);
  }
  return DB;
});
