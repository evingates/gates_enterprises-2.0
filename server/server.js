const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('express-async-errors'); // patches express route handlers to catch async errors automatically
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./src/middleware/errorMiddleware');

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const companyRoutes = require('./src/routes/companyRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

app.use(errorMiddleware);



// Serve static frontend files
app.use(express.static(path.join(__dirname, '../client')));

// Any unknown frontend route gets redirected or defaults to jobs page
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../client/jobs.html'));
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
