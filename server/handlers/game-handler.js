const mexp = require('math-expression-evaluator');
const {lettersSolver} = require('../utils/algorithms');
const {appendFile} = require('fs');

//classes
//==================================
const Game = require("../utils/GameObj.js");
const PlayerObj = require("../utils/PlayerObj.js");

//variables
//==================================
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

let io;

const vowels = ["A", "E", "I", "O", "U"];
const consonants = [
  "D",
  "H",
  "T",
  "N",
  "S",
  "P",
  "Y",
  "F",
  "G",
  "C",
  "R",
  "L",
  "Q",
  "J",
  "K",
  "X",
  "B",
  "M",
  "W",
  "V",
  "Z",
];
const weights = [
  4, 8, 12, 16, 20, 23, 26, 29, 31, 33, 35, 37, 38, 39, 40, 41, 42, 43, 44, 45,
  46,
];
const weights2 = [
  4.3, 6.1, 9.1, 6.7, 6.3, 1.9, 2.0, 2.2, 2.0, 2.8, 6.0, 4.0, 0.01, 0.15, 0.77,
  0.15, 1.5, 2.4, 2.4, 0.98, 0.07,
];

// small numbers
const smallNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const AVAILABLE_SMALL_NUMBERS = 9;
// large numbers
const largeNumbers = ["25", "50", "75", "100"];
const AVAILABLE_LARGE_NUMBERS = 4;

let global = new Game();
global.name = "Global Game";
let rooms = new Map();
rooms.set(global.name, global);

//debug functions
//====================================
printAllRooms = () => console.log(rooms);

printRoom = (room) => console.log(rooms.get(room));

printPlayers = (room) => console.log(rooms.get(room).players);

//functions
//====================================
addVowel = (room) => {
  let g = rooms.get(room);
  if (!g) return;
  if (g.vowelCount == 5) return;
  if (g.letterCount == 9) return;
  let vowel = generateVowel(g.letters);
  let index = g.letters.length;
  g.letters[g.letterCount] = vowel;
  g.vowelCount++;
  io.to(room).emit("add-letter", vowel, g.letterCount);
  g.letterCount++;
};

generateVowel = (letters, firstTry = true) => {
  let vowel = vowels[Math.floor(Math.random() * 5)];
  if (firstTry && letters.includes(vowel))
    vowel = generateVowel(letters, false);
  return vowel;
};

addConsonant = (room) => {
  let g = rooms.get(room);
  if (!g) return;
  if (g.consonantCount == 6) return;
  if (g.letterCount == 9) return;
  let consonant = generateConsonant(g.letters);
  let index = g.letters.length;
  g.letters[g.letterCount] = consonant;
  g.consonantCount++;
  io.to(room).emit("add-letter", consonant, g.letterCount);
  g.letterCount++;
};

// generateConsonant = {
// let random = Math.floor(Math.random() * (weights[20]+1));
// for (let i=0; i<21; i++) {
// if (weights[i] > random) {
// consonant = consonants[i]
// break;
// }
// }
// }

generateConsonant = (letters, firstTry = true) => {
  let consonant;
  let random = Math.floor(Math.random() * 61.5);
  for (let i = 0; i < 21; i++) {
    if (weights2[i] > random) {
      consonant = consonants[i];
      break;
    }
    random -= weights2[i];
  }
  if (firstTry && letters.includes(consonant))
    consonant = generateConsonant(letters, false);
  return consonant;
};

// g.words[0].score

// {
//   username: hadas,
//   word: hello,
//   score: 5
// }

submitWord = async (socket, word, username, room) => {
  let g = rooms.get(room);
  if (!g) return;
  const score = await scoreWord(word, g.letters);
	if (typeof score === "object" && score.offensive) {
		io.to(socket.id).emit("bad-word");
		return;
	}
  g.words.push({ word, username, score });
  io.to(room).emit("append-word", word, username, score);
};

scoreWord = async (word, letters) => {
  let checklist = new Array(word.length);
  checklist.fill(false);

  //make sure every letter in the word is in letters
  for (let i = 0; i < letters.length; i++)
    for (let j = 0; j < word.length; j++)
      if (letters[i] === word[j] && !checklist[j]) {
        checklist[j] = true;
        break;
      }
  for (let j = 0; j < checklist.length; j++) if (!checklist[j]) return 0;

  //make sure it's in the dictionary
	const result = await inDictionary(word);
  if (!result) return 0;
	if (typeof result === "object") return result;

  return word.length;
};

inDictionary = async (word) => {
  if (process.env.NODE_ENV == "development") return true;
  try {
    const response = await fetch(
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.DICTIONARY_KEY}`
    );
    const data = await response.json();
    if (data.length == 0) throw `Problem contacting DictionaryApi: Got []`;
		if (typeof data[0] === "string")	return false;
		if (isOffensive(data)) return {offensive: true};
		return true;
  } catch (err) {
    console.error(err);
    return false;
  }
	return false;
};

isOffensive = (data) => {
	for (let i=0; i<data.length; i++)
		if (data[i].meta.offensive) return true;
	return false;
};

restartLetters = (room) => {
  let g = rooms.get(room);
  if (!g) return;
  let turn = g.restart();
  tellTurn(g, turn);
  io.to(room).emit("clear-letters");
};


function getLettersState(room, cb) {
  let g = rooms.get(room);
  if (!g) return;
  cb(g.letters, g.words)
};
// nextTurn ??
getHint = async (username, room) => {
	let g = rooms.get(room);
	if (!g) return;
	const {word, score} = await recurseGetHint(g.letters);
	g.words.push({ username, word, score });
	io.to(room).emit("append-word", word, username, score);
}

recurseGetHint = async (letters) => {
	let word = lettersSolver(letters, getHintSize());
	if (word === null) {
		const hint = await recurseGetHint(letters);
		word = hint.word;
	}
	let score = await scoreWord(word, letters);
	let hint = {word, score};
	if (typeof score === "object" && score.offensive) {
		logInvalidWord(word);
		hint = await recurseGetHint(letters);
	}
	if (score === 0) {
		logInvalidWord(word);
		hint = await recurseGetHint(letters);
	}
	return hint;	
}

logInvalidWord = (word) => {
	appendFile('./logs/invalid_words.log', word+'\n', 'utf-8', (err) => {console.log(err)});
}

getHintSize = () => {
	const sizes   = [5,   6,  7, 8, 9];
	const weights = [60, 45, 15, 5, 1];
	let random = Math.floor(Math.random() * 126);
	for (let i=0; i<sizes.length; i++) {
		if (weights[i] >= random)
			return sizes[i];
		else
			random -= weights[i];
	}
	return 5;
}

nextRound = (room) => {
  let g = rooms.get(room);
  if (!g) return;
  let turn = g.nextTurn();
  io.to(room).emit('new-round', g.round);
  io.to(room).emit("clear-letters");
  io.to(room).emit("send-players", g.players);
  tellTurn(g, turn);
};

saveScore = (score, room, username) => {
  let g = rooms.get(room);
  if (!g) return;
  let player = g.getPlayer(username);
	if (!player) return;
  player.score += score;
};



addSmallNumber = (room) => {
  let g = rooms.get(room);
  if (g.smallNumberCount == 4) return;
  let number =
    smallNumbers[Math.floor(Math.random() * AVAILABLE_SMALL_NUMBERS)];
  if (addNumber(g, number)) g.smallNumberCount++;

  io.to(room).emit("add-number", number, g.numberCount);
  g.numberCount++;
};

const addLargeNumber = (room) => {
  let g = rooms.get(room);
  if (g.largeNumberCount == 4) return;
  let number =
    largeNumbers[Math.floor(Math.random() * AVAILABLE_LARGE_NUMBERS)];

  if (addNumber(g, number)) g.largeNumberCount++;
  io.to(room).emit("add-number", number, g.numberCount);
  g.numberCount++;
};

const addNumber = (g, number) => {
  if (g.numberCount === 6) return false;
  g.numbers[g.numberCount] = number;
  return true;
};

function getRandomNumber(room) {
  let g = rooms.get(room);
  if (g.numberCount == 6) {
    let randomNumber = Math.floor(Math.random() * (999 - 101)) + 101;
    g.target = randomNumber;
    io.to(room).emit("add-target", g.target);
  }


}

function calculateTotal(operationArr, username, room) {
  let g = rooms.get(room);
  let total;
  let score;
  try {
    total = mexp.eval(operationArr.join(''));
    score = scoreAnswer(total, g);
  } catch (err) {
    total = 0;
    score = 0;
  }
  g.operations.push({ total, operationArr, username, score });
  io.to(room).emit("append-operations", total, operationArr, username, score);
}

function scoreAnswer(total, g) {
  let difference = Math.abs(g.target - total);
  let score = 0;
  if (difference === 0) {
    score = 10;
  } else if (difference >= 1 && difference <= 20) {
    score = 7;
  } else if (difference >= 21 && difference <= 40) {
    score = 5;
  } else if (difference >= 41 && difference <= 60) {
    score = 2;
  } else score = 0;

  return score;
}

function getNumbersState(room, cb) {
  let g = rooms.get(room);
  if (!g) return;
  cb(g.numbers, g.operations, g.target, g.numberCount)
};


joinRoom = (socket, room, oldRoom, username, callback) => {
  //get the rooms
  let g = rooms.get(room);
  if (!g) {
    g = new Game(room); //create the room
    rooms.set(room, g);
  }
  //join the rooms
  socket.join(room);
  //add the players
	const player = new PlayerObj(username, socket.id);
  let turn = g.add(player);
	if (player.username !== username)
		setTimeout(
			() => io.to(socket.id).emit("update-username", player.username),
			2000
		);
  tellTurn(g, turn);
  //leave the old room
  leaveRoom(socket, oldRoom);
  //send it back to client
  callback(true, room);
  setTimeout(
    () => io.to(socket.id).emit("set-game-state-room", g.round),
    1000
  );
  setTimeout(() => io.to(room).emit("send-players", g.players), 1500);
};

leaveRoom = (socket, room) => {
  socket.leave(room);
  let g = rooms.get(room);
  if (!g) return;
  let turn = g.remove(socket.id);
  if (g.players.length == 0) {
    rooms.delete(room);
    return;
  }
  tellTurn(g, turn);
};

tellTurn = (g, turn) => {
  let player = g.players[turn];
  setTimeout(() => io.to(player.id).emit("your-turn"), 1000);
};

disconnect = (socket, reason) => {
  console.log(`disconnect:  ${socket.id}`);
  const socketRooms = socket.adapter.rooms;
  socketRooms.forEach((value, key) => {
    leaveRoom(socket, key);
  });
};


//listeners
//=====================================
const registerGameHandler = (newio, socket) => {
  console.log(socket.id);
  io = newio;
  // letters game
  socket.on("add-vowel", addVowel);
  socket.on("add-consonant", addConsonant);
  socket.on("submit-word", (word, username, room) => 
		submitWord(socket, word, username, room)
	);
  socket.on("restart-letters", restartLetters);
  socket.on("get-letters-state", getLettersState);
	socket.on("get-hint", getHint);
  // players
  socket.on("join-game", (room, oldRoom, username, cb) =>
    joinRoom(socket, room, oldRoom, username, cb)
  );
  socket.on("next-round", nextRound);
  // socket.on("save-score", saveScore);
  socket.on("disconnecting", (reason) => disconnect(socket, reason));
  //debug
  socket.on("print-all-rooms", printAllRooms);
  socket.on("print-room", printRoom);
  socket.on("print-players", printPlayers);
  // numbers game
  socket.on("add-small", addSmallNumber);
  socket.on("add-large", addLargeNumber);
  socket.on("set-target", getRandomNumber);
  socket.on("submit-calculation", calculateTotal);
  socket.on("get-numbers-state", getNumbersState);


};

//export
//=====================================
module.exports = registerGameHandler;
