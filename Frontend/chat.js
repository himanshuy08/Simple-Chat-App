// Establish a Socket.IO connection to the server
const socket = io("http://localhost:4001");

// Function to handle sending messages
function sendMessage(message) {
    // Emit a "chatMessage" event to the server with the message content
    socket.emit("chatMessage", { message: message }); // Emitting an object with the message property
}

// Function to display incoming messages in the chat interface
function displayMessage(sender, message, timestamp) {
    // Construct HTML for the message
    const messageHTML = `
        <div class="flex items-start gap-4">
            <div class="flex flex-col gap-1">
                <div class="text-sm font-medium">${sender}</div>
                <div>${message}</div>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400 self-end">${timestamp}</div>
        </div>
    `;

    // Append the message to the chat container
    const chatContainer = document.querySelector(".chat-container");
    chatContainer.innerHTML += messageHTML;
    // Scroll to the bottom of the chat container to show the latest message
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Prompt the user for their name when the page loads
const username = prompt("Please enter your name:");

// Event listener for the send button
const sendButton = document.querySelector(".send-button");
sendButton.addEventListener("click", () => {
    const inputField = document.querySelector(".message-input");
    const message = inputField.value.trim();
    if (message !== "") {
        // Send the message to the server
        sendMessage(message);
        // Clear the input field after sending the message
        inputField.value = "";
    }
});

// Event listener for receiving messages from the server
socket.on("chatMessage", (data) => {
    // Display the incoming message in the chat interface
    displayMessage(data.sender, data.message, data.timestamp);
});

// Event listener for receiving the welcome message from the server
socket.on("welcome", (message) => {
    // Display the welcome message in the chat interface
    displayMessage("Server", message, new Date().toLocaleTimeString());
});

// Send the username to the server
socket.emit("username", username);
