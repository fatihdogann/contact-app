const express = require('express');
const cors = require('cors');
const path = require('path');
const contactsRouter = require('./routes/contacts');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/contacts', contactsRouter);

// Static frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// Fallback to index.html for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
