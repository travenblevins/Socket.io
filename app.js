import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const port = process.env.PORT || 3000;
const clients = [];
app.use(express.static('public'));
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
        // Broadcast to all clients that a user has disconnected
        socket.broadcast.emit('chat message', 'A user has disconnected');
    });
    socket.on('newClient', (username) => {
        console.log('new client ' + username);
        clients.push({id: socket.id, username});
        io.emit('newClient', username);
    });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});
httpServer.listen(port, () => {
    console.log(`listening on *:${port}`);
})