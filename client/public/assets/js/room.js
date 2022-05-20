//variables
//==================================
let room = "myRoom";

const roomNameEl    = document.querySelector('#room-name');
const joinGlobalBtn = document.querySelector('#join-global');
const joinRoomBtn   = document.querySelector('#join-room');
const createRoomBtn = document.querySelector('#create-room');
const roomNameInput = document.querySelector('#room-name-input');

//functions
//====================================
const joinGlobal = () => {
	socket.emit('join-room', 'Global Game', message => console.log(message));
	console.log(socket.id);
};

const joinRoom = () => {
	socket.emit('join-room', roomNameInput.value, message => console.log(message));
};

const createRoom = () => {
	socket.emit('join-room', roomNameInput.value, message => console.log(message));
};








//listeners
//=====================================
joinGlobalBtn.addEventListener('click', joinGlobal);
joinRoomBtn.addEventListener('click', joinRoom);
createRoomBtn.addEventListener('click', createRoom);





//body
//=====================================
joinGlobal();
