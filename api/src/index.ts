import { config } from 'dotenv';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Connect to the PostgreSQL database
import connectToDatabase from './service/db';
import {login, register, validateToken} from './controller/userController';
import {getWeather} from "./controller/weatherController";

// Load environment variables
config();

// Environment variables
const { API_PORT, PORT } = process.env;
const port = Number(PORT) || Number(API_PORT) || 8000;

// Create Express app
const app = express();

// Use body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Connect to the PostgreSQL database
async function startServer() {
  try {

    await connectToDatabase();

    // Additional server setup and start code
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to the database', error);
  }
}

startServer();

// Routes
// Register user
app.post('/register', register);

// Login
app.post('/login', login);

// validate token
app.get('/validate_token', validateToken, (req, res) => {
  res.json({ message: 'Access granted' });
});

//get weather
app.post('/get_weather', getWeather);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});
