const {
	addVowel,
	addConsonant,
	submitWord,
	restartLetters,
	getLettersHint
} = require('./lettersGame');

const {
	addSmallNumber,
	addLargeNumber,
	getRandomNumber,
	calculateTotal
} = require('./numbersGame');

const {
	joinRoom,
	nextRound,
	saveScore,
	disconnect
} = require('./playerFunctions');

//variables
//==================================
global.rooms = new Map();

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
  socket.on("restart-letters", restartLetters);
  socket.on("game-state", (cb) => cb(g.letters, g.words));
	socket.on("get-hint", getLettersHint);
  // numbers game
  socket.on("add-small", addSmallNumber);
  socket.on("add-large", addLargeNumber);
  socket.on("set-target", getRandomNumber);
  socket.on("submit-calculation", calculateTotal);
  // players
  socket.on("join-game", (room, oldRoom, username, cb) =>
    joinRoom(socket, room, oldRoom, username, cb)
  );
  socket.on("next-round", nextRound);
  socket.on("save-score", saveScore);
  socket.on("disconnecting", (reason) => disconnect(socket, reason));
  //debug
  socket.on("print-all-rooms", printAllRooms);
  socket.on("print-room", printRoom);
  socket.on("print-players", printPlayers);
};

//export
//=====================================
module.exports = registerGameHandler;
