const nameButton = document.getElementById('name-button');
const joinRoomButton = document.getElementById('room-button');
const messageInput = document.getElementById('message-input');
const nameInput = document.getElementById('name-input');
const roomInput = document.getElementById('room-input');
const connectButton = document.getElementById('connect');
const form = document.getElementById('form');

let name = 'Guest';

const connectFunction = socket => {
	socket.on('connect', () => {
		displayMessage(`You connected with id: ${socket.id}`);
	});

	socket.on('receive-message', message => {
		displayMessage(message);
	});
};

form.addEventListener('submit', e => {
	e.preventDefault();
	if (messageInput.value === '') return;

	const message = `${name}: ${messageInput.value}`;
	const room = roomInput.value;
	
	displayMessage(message);
	socket.emit('send-message', message, room);
	
	messageInput.value = '';
});

joinRoomButton.addEventListener('click', () => {
	const room = roomInput.value;
	socket.emit('join-room', room, message => {
		displayMessage(message);	//this is a callback function. it will be called by the server in its .on() furction
	});
});

nameButton.addEventListener('click', () => {
	name = nameInput.value;
});

connectButton.addEventListener('click', () => {
	socket.disconnect();
	socket = io();
	connectFunction(socket);
});

function displayMessage(message) {
	const div = document.createElement('div');
	div.textContent = message;
	document.getElementById('message-container').append(div);
}

console.log('socket.js running');
let socket = io();	//front is same domain as server
connectFunction(socket);
