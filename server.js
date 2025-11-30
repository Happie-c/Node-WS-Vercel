const express = require('express');
const WebSocket = require('ws');


const app = express();
const PORT = 4000;
const url = 'wss://eu-swarm-ws-re.betcoswarm.com/';
const socket = new WebSocket(url);


app.get('/home', (req, res) => {
    socket.on('open', () => {
        console.log('Connected to the WebSocket server');

        // If the server requires an initial message (subscribe, auth, etc.),
        // you would send it here:
        // socket.send(JSON.stringify({ action: "subscribe", id: 123 }));
        res.status(200).json('Socket works');
    });
    socket.on('message', (data) => {
        console.log('Received:', data.toString());
        res.status(200).json(data);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;