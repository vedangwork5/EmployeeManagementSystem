require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const employeesRoutes = require('./routes/employees');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/employees', employeesRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongo connected');
    app.listen(PORT, () => console.log(`Server started on ${PORT}`));
  })
  .catch(err => {
    console.error('DB conn error', err);
  });
