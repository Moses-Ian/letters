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
	socket.emit('join-game', 'Global Game', (success, newRoom) => {
		if (success) {
			room = newRoom;
			roomNameEl.textContent = newRoom;
			// socket.emit('game-state', room, setGameState);
		}
	});
	console.log(`joinRoom Global Game`);
};

const joinRoom = () => {
	socket.emit('join-game', roomNameInput.value, message => console.log(message));
	console.log(`joinRoom ${roomNameInput.value}`);
};

const createRoom = () => {
	socket.emit('join-game', roomNameInput.value, (success, newRoom) => {
		if (success) {
			room = newRoom;
			roomNameEl.textContent = newRoom;
		}
	});
	console.log(`joinRoom ${roomNameInput.value}`);
};








//listeners
//=====================================
joinGlobalBtn.addEventListener('click', joinGlobal);
joinRoomBtn.addEventListener('click', joinRoom);
createRoomBtn.addEventListener('click', createRoom);





//body
//=====================================
// joinGlobal();
