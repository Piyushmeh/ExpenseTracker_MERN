require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
const app = express();

const PORT = process.env.PORT || 5000;
console.log('PORT:', PORT);

app.use(express.json());

// ✅ FIXED CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:3000',                                    // For local development
    'https://expense-tracker-mern-eight-flame.vercel.app'       // Your Vercel frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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