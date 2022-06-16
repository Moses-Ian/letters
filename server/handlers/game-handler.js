const {
	addVowel,
	addConsonant,
	submitWord,
	getLettersState,
	getLettersHint
} = require('./lettersGame');

const {
	addSmallNumber,
	addLargeNumber,
	getRandomNumber,
	calculateTotal,
	getNumbersState,
	getNumbersHint
} = require('./numbersGame');

const {
	listRooms,
	joinRoom,
	leaveRoom,
	nextRound,
	saveScore,
	restartGame,
	disconnect
} = require('./playerFunctions');

//classes
//==================================
class MyMap extends Map {
	get(key) {
		return super.get(key.toLowerCase());
	}
	set(key, value) {
		return super.set(key.toLowerCase(), value);
	}
}

//variables
//==================================
global.rooms = new MyMap();

//variables
//==================================
// global.rooms = new Map();

//debug functions
//====================================
printAllRooms = () => console.log(rooms);
printRoom = (room) => console.log(rooms.get(room));
printPlayers = (room) => console.log(rooms.get(room).players);

//listeners
//=====================================
const registerGameHandler = (newio, socket) => {
  console.log(socket.id);
  global.io = newio;
  // letters game
  socket.on("add-vowel", addVowel);
  socket.on("add-consonant", addConsonant);
  socket.on("submit-word", (word, username, room) => 
		submitWord(socket, word, username, room)
	);
  socket.on("get-letters-state", getLettersState);
	socket.on("get-letters-hint", getLettersHint);
  // numbers game
  socket.on("add-small", addSmallNumber);
  socket.on("add-large", addLargeNumber);
  socket.on("set-target", getRandomNumber);
  socket.on("submit-calculation", calculateTotal);
  socket.on("get-numbers-state", getNumbersState);
	socket.on("get-numbers-hint", getNumbersHint);
  // players
	socket.on("list-rooms", listRooms);
  socket.on("join-game", (room, oldRoom, username, cb) =>
    joinRoom(socket, room, oldRoom, username, cb)
  );
	socket.on("leave-game", (oldRoom, cb) =>
		leaveRoom(socket, oldRoom, cb)
	);
  socket.on("next-round", nextRound);
  socket.on("restart-game", restartGame);
  socket.on("disconnecting", (reason) => disconnect(socket, reason));
  //debug
  socket.on("print-all-rooms", printAllRooms);
  socket.on("print-room", printRoom);
  socket.on("print-players", printPlayers);
};

//export
//=====================================
module.exports = registerGameHandler;
