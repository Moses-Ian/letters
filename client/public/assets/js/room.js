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
	console.log('global');
	socket.emit('join-game', 'Global Game', room, (success, newRoom) => {
		if (success) {
			room = newRoom;
			roomNameEl.textContent = newRoom;
		}
	});
	console.log(`joinRoom Global Game`);
};

const joinRoom = () => {
	console.log('join');
	socket.emit('join-game', roomNameInput.value, room, (success, newRoom) => {
		if (success) {
			room = newRoom;
			roomNameEl.textContent = newRoom;
		}
	});
	console.log(`joinRoom ${roomNameInput.value}`);
};

const createRoom = () => {
	console.log('create');
	socket.emit('join-game', roomNameInput.value, room, (success, newRoom) => {
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
