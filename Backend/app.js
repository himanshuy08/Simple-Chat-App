// Import necessary modules
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from 'url';
import cors from 'cors';

// Get current filename and dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Enable CORS middleware
app.use(cors({
  origin: "http://127.0.0.1:5501",
  credentials: true,
}));

// Create HTTP server using Express app
const server = createServer(app);

// Create Socket.IO server using HTTP server
const io = new Server(server);

// Define port number
const PORT = 4001;

// Serve static files
app.use(express.static(path.join(__dirname, "../Frontend")));

// Define route for serving index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend", "index.html"));
});

// Event listener for client connections
io.on("connection", (socket) => {
    console.log("Connection Made", socket.id);

    // Event listener for receiving username from the client
    socket.on("username", (username) => {
        // Store the username associated with this socket
        socket.username = username;

        // Send a welcome message to the newly connected client
        socket.emit("welcome", `Welcome to the chat, ${username}!`);
    });

    // Event listener for receiving messages from clients
    socket.on("chatMessage", (data) => {
        // Check if the username is defined for this socket
        if (!socket.username) {
            // If username is not defined, do not process the message
            console.log("Error: Username not defined for socket", socket.id);
            return;
        }

        // Construct the message object with sender's name
        const messageData = {
            sender: socket.username,
            message: data.message,
            timestamp: new Date().toLocaleTimeString()
        };

        // Broadcast the received message to all connected clients
        io.emit("chatMessage", messageData);
    });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on : http://localhost:${PORT}`);
});
