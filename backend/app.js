require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
const app = express();

const PORT = process.env.PORT;
console.log('PORT:', PORT);

app.use(express.json());
app.use(cors());

readdirSync('./routes').map((route) =>
  app.use('/api/v1', require('./routes/' + route))
);

const server = () => {
  db();
  app.listen(PORT, () => {
    console.log('listening to port:', PORT);
  });
};

server();
