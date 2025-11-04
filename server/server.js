const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const keys = new Map();

function generateKey(station, testTitle) {
  var random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return (station || 'XXXX') + '-' + (testTitle || 'test') + '-' + random;
}

function cleanupExpiredKeys() {
  const now = Date.now();
  for (const [key, value] of keys) {
    if (now > value.expires) {
      keys.delete(key);
    }
  }
}

function hasValidKeys() {
  cleanupExpiredKeys();
  return keys.size > 0;
}

app.post('/create', (req, res) => {
  const { data, station, testTitle } = req.body;
  const key = generateKey(station, testTitle);
  keys.set(key, {
    data: data,
    expires: Date.now() + (30 * 60 * 1000)
  });
  res.json({ key });
});

app.get('/data/:key', (req, res) => {
  const key = req.params.key;
  const keyData = keys.get(key);
  
  if (!keyData || Date.now() > keyData.expires) {
    return res.status(404).json({ error: 'Key not found or expired' });
  }
  
  const data = keyData.data;
  keys.delete(key);
  res.json({ data });
});

app.get('/ping', (req, res) => {
  if (hasValidKeys()) {
    res.status(200).send('ok');
  } else {
    res.status(204).send();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
