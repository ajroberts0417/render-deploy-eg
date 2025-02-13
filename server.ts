import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.ORIGIN || "http://localhost:5175",
        methods: ["GET", "POST"]
    }
});
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello via Express!');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Add your socket event handlers here
    socket.on('message', (msg) => {
        io.emit('message', msg); // Broadcast message to all connected clients
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});