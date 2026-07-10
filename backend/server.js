const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const { MONGO_USER, MONGO_PASSWORD, MONGO_DB } = process.env;
const mongoUri = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@db:27017/${MONGO_DB}?authSource=admin`;

app.use(cors());
app.use(express.json());

// 'db' is the service name from docker-compose.yml
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected successfully...!'))
  .catch(err => console.log('MongoDB connection error:', err));

const Note = mongoose.model('Note', { text: String });

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/notes', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.post('/api/notes', async (req, res) => {
  const note = new Note({ text: req.body.text });
  await note.save();
  res.json(note);
});

app.listen(5000, () => console.log('Backend API running on port 5000'));
