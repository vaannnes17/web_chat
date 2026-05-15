import { Server } from "socket.io";
import { messageHistory } from './rest.js';

export function initSocket(httpServer) {
    const io = new Server(httpServer);
    const clients = {};

    io.on("connection", (socket) => {
        console.log("New connection:", socket.id);

        socket.on("register", (name) => {
            const userName = name || `Guest_${socket.id.substring(0, 4)}`;
            clients[socket.id] = { name: userName };
            
            io.emit("clientsList", clients);
            
            if (messageHistory.length > 0) {
                socket.emit("messageHistory", messageHistory);
            }
        });

        socket.on("message", (text) => {
            if (clients[socket.id]) {
                const messageData = {
                    from: clients[socket.id].name,
                    text: text,
                    timestamp: new Date().toISOString()
                };
                
                messageHistory.push(messageData);
                if (messageHistory.length > 50) {
                    messageHistory.shift();
                }
                
                io.emit("chatMessage", messageData);
            }
        });

        socket.on("typing", () => {
            if (clients[socket.id]) {
                socket.broadcast.emit("userTyping", {
                    name: clients[socket.id].name,
                    isTyping: true
                });
            }
        });

        socket.on("stopTyping", () => {
            if (clients[socket.id]) {
                socket.broadcast.emit("userTyping", {
                    name: clients[socket.id].name,
                    isTyping: false
                });
            }
        });

        socket.on("disconnect", () => {
            if (clients[socket.id]) {
                const userName = clients[socket.id].name;
                delete clients[socket.id];
                io.emit("clientsList", clients);
                io.emit("userDisconnected", { name: userName });
            }
        });
    });
}