// Connect to the Socket.IO server
const socket = io('http://localhost:5500');

// DOM elements
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Function to append messages to the chat container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position); // Position of the message in the chat
    messageContainer.append(messageElement);
};

// Event listener for form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'left'); // Append user's message to the chat container
    socket.emit('send', message); // Emit the message to the server
    messageInput.value = ''; // Clear the message input field
});

// Prompt user to enter their name to join the chat
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name); // Emit a 'new-user-joined' event to the server with the user's name

// Event listener for 'user-joined' event
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'left'); // Append a message indicating user joined the chat
});

// Event listener for 'receive' event
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'right'); // Append received message from another user
});

// Event listener for 'left' event
socket.on('left', name => {
    append(`${name} left the chat`, 'left'); // Append a message indicating user left the chat
});
