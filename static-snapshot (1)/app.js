require('dotenv').config();
const express = require('express');
const handlebars = require('express-handlebars');
const {
  insertKeyValuePair,
  deleteKeyValuePair,
  updateKeyValuePairFromKey,
  getKeyValuePairByID,
  getKeyValuePairByKey,
  getKeyValuePairs,
  createTableIfNotExist
} = require('./db');
const axios = require('axios');
const http = require('http');
const { Server: WebSocketServer } = require('ws');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  createTableIfNotExist();
  res.redirect('/api/getall');
});

app.get('/api', async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.send('Hello World!'); //write a response to the client
});

app.get('/api/getall', async (req, res) => {
  const promise = getKeyValuePairs();
  res.send(JSON.stringify(promise));
});

app.get('/api/getfromkey', async (req, res) => {
  const promise = await getKeyValuePairByKey(req.query.key);
  res.send(JSON.stringify(promise));
});

app.post('/api/insertvalue', async (req, res) => {
  const promise = await insertKeyValuePair({
    key: req.body.key,
    value: req.body.value,
  });
  return res.json({ promise });
});

app.delete('/api/deletevalue', async (req, res) => {
  const data = await deleteKeyValuePair(req.body.id);
  return res.json({ data });
});

const server = http.createServer(app);

// Development
if (process.env.NODE_ENV === 'development') {
  const wss = new WebSocketServer({ server });
  wss.on('connection', (ws) => {
    ws.send('connected');
    const interval = setInterval(() => {
      ws.ping();
    }, 30000);
  });
}

server.listen(port, () => {
  console.log(`App listening to port ${port}`);
});

