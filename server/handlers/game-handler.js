//classes
//==================================
const Game = require("../utils/GameObj.js");

//variables
//==================================
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

let io;

const vowels = ['a','e','i','o','u'];
const consonants = ['d','h','t','n','s','p','y','f','g','c','r','l','q','j','k','x','b','m','w','v','z'];
const weights =    [ 4 , 8 , 12, 16, 20, 23, 26, 29, 31, 33, 35, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];
const weights2 =   [4.3,6.1,9.1,6.7,6.3,1.9,2.0,2.2,2.0,2.8,6.0,4.0,.01,.15,.77,.15,1.5,2.4,2.4,.98,.07];

let global = new Game();
global.name = "Global Game";
let rooms = new Map();
rooms.set(global.name, global);

//functions
//====================================
addVowel = (room) => {
  console.log("Add vowel", room);
  let g = rooms.get(room);
  if (g.vowelCount == 5) return;
  if (g.letters.length == 9) return;
  let vowel = vowels[Math.floor(Math.random() * 5)];
  let index = g.letters.length;
  g.letters.push(vowel);
  g.vowelCount++;
  io.emit("add-letter", vowel, index);
};

addConsonant = (room) => {
	let g = rooms.get(room);
	if (g.consonantCount == 6)
		return;
	if (g.letters.length == 9)
		return;
	let consonant = generateConsonant();
	let index = g.letters.length;
	g.letters.push(consonant);
	g.consonantCount++;
	io.to(room).emit('add-letter', consonant, index);
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

generateConsonant = () => {
	let consonant;
	let random = Math.floor(Math.random() * 61.5);
	for (let i=0; i<21; i++) {
		if (weights2[i] > random) {
			consonant = consonants[i];
			break;
		}
		random -= weights2[i];
	}
	return consonant
};

submitWord = async (word, room) => {
  let g = rooms.get(room);
  const score = await scoreWord(word, g.letters);
  g.words.push({ word, score });
  io.to(room).emit("append-word", word, score);
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
  if (!(await inDictionary(word))) return 0;

  return word.length;
};

inDictionary = async (word) => {
  try {
    const response = await fetch(
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.DICTIONARY_KEY}`
    );
    const data = await response.json();
    return typeof data[0] != "string";
  } catch (err) {
    console.error(err);
    return false;
  }
};

restartLetters = (room) => {
  let g = rooms.get(room);
  g.restart();
  io.to(room).emit("clear-letters");
};

joinRoom = (socket, room, oldRoom, callback) => {
  console.log(room);
  //get the rooms
  let g = rooms.get(room);
  if (!g) {
    g = new Game(room); //create the room
    rooms.set(room, g);
  }
  let oldG = rooms.get(oldRoom);
  //join/leave the rooms
  socket.join(room);
  socket.leave(oldRoom);
  //add/remove the players
  g.add(socket.id);
  oldG?.remove(socket.id);
  //send it back to client
  callback(true, room);
  io.to(socket.id).emit("set-game-state", g.letters, g.words);
};

//listeners
//=====================================
const registerGameHandler = (newio, socket) => {
  console.log(socket.id);
  io = newio;
  socket.on("add-vowel", addVowel);
  socket.on("add-consonant", addConsonant);
  socket.on("submit-word", submitWord);
  socket.on("restart-letters", restartLetters);
  socket.on("game-state", (cb) => cb(g.letters, g.words));
  socket.on("join-game", (room, oldRoom, cb) =>
    joinRoom(socket, room, oldRoom, cb)
  );
};

//export
//=====================================
module.exports = registerGameHandler;
