const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const authRoutesFactory = require('./routes/auth');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Postgres pool (configure DATABASE_URL env var in production)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/your_database'
});

// mount auth routes, pass pool
app.use('/', authRoutesFactory({ pool }));

// serve static frontend files (public folder)
app.use(express.static(path.join(__dirname, 'public')));

// fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
