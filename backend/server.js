import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import pool from './config/database.js';
import employeesRoutes from './routes/employees.js';

dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Define routes
app.use('/api/employees', employeesRoutes);

const PORT = process.env.PORT || 5000;

// Test MySQL connection and start the server
const startServer = async () => {
  try {
    // Test database connection
    const connection = await pool.getConnection();
    console.log('MySQL connected successfully');
    connection.release();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

startServer();
