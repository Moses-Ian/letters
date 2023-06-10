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
	getTargetNumber,
	calculateTotal,
	getNumbersState,
	getNumbersHint
} = require('./numbersGame');

const {
	listRooms,
	updateUsername,
	joinRoom,
	leaveRoom,
	updateScores,
	nextRound,
	getRealUsernames,
	restartGame,
	disconnect,
	joinQueue,
	leaveQueue
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
	delete(key) {
		return super.delete(key.toLowerCase());
	}
}

// global.functions = {
	// addVowel
// }

//variables
//==================================
global.rooms = new MyMap();
global.queue = new Array(0);

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
	socket.on("get-letters-hint", (username, room, jwt, cb) => 
		getLettersHint(socket, username, room, jwt, cb));
  // numbers game
  socket.on("add-small", addSmallNumber);
  socket.on("add-large", addLargeNumber);
  socket.on("set-target", getTargetNumber);
  socket.on("submit-calculation", (operationArr, username, room) =>
		calculateTotal(socket, operationArr, username, room));
  socket.on("get-numbers-state", getNumbersState);
	socket.on("get-numbers-hint", (username, room, jwt, cb) => 
		getNumbersHint(socket, username, room, jwt, cb));
  // players
	socket.on("list-rooms", listRooms);
	socket.on("update-username", (room, username) => 
		updateUsername(socket, room, username)
	);
  socket.on("join-game", (room, oldRoom, username, options, cb) =>
    joinRoom(socket, room, oldRoom, username, options, cb)
  );
	socket.on("leave-game", (oldRoom, cb) =>
		leaveRoom(socket, oldRoom, cb)
	);
	socket.on("get-real-usernames", getRealUsernames);
  socket.on("restart-game", restartGame);
  socket.on("disconnecting", (reason) => disconnect(socket, reason));
	socket.on("join-queue", () => joinQueue(socket));
	socket.on("leave-queue", () => leaveQueue(socket));
  //debug
	socket.on("update-scores", updateScores);
  socket.on("next-round-button", nextRoundClicked);
  socket.on("print-all-rooms", printAllRooms);
  socket.on("print-room", printRoom);
  socket.on("print-players", printPlayers);
};

//export
//=====================================
module.exports = registerGameHandler;
