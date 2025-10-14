const express = require('express');
const cors = require('cors');
const path = require('path');
const contactsRouter = require('./routes/contacts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/contacts', contactsRouter);

// Static frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// Fallback to index.html for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
