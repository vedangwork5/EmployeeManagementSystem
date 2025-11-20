import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import employeesRoutes from './routes/employees.js';

dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Define routes
app.use('/api/employees', employeesRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB and start the server
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongo connected');
    app.listen(PORT, () => console.log(`Server started on ${PORT}`));
  })
  .catch(err => {
    console.error('DB connection error', err);
  });
