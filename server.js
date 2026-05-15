import { app } from './rest.js';
import { initSocket } from './socket.js';
import http from 'node:http';

const port = process.env.PORT || 3000;
const server = http.createServer(app);

initSocket(server);

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});