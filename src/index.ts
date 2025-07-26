import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import {  getAllBot, startBotById, startEngine, stopBotById, stopEngine, getBotById } from './controller';
import setupWebSocket from './wsServer';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Setup WebSocket
setupWebSocket(wss);

// REST endpoints
app.post('/start', startEngine);
app.post('/stop', stopEngine);
app.get('/get/all', getAllBot);
app.get('/get/:id', getBotById);
app.get('/start/:id', startBotById)
app.get('/stop/:id', stopBotById)

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Bot Service running on port ${PORT}`);
});