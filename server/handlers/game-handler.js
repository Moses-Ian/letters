//classes
//==================================
const Game = require("../utils/GameObj.js");

//variables
//==================================
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

let io;

const vowels = ["a", "e", "i", "o", "u"];
const consonants = [
  "d",
  "h",
  "t",
  "n",
  "s",
  "p",
  "y",
  "f",
  "g",
  "c",
  "r",
  "l",
  "q",
  "j",
  "k",
  "x",
  "b",
  "m",
  "w",
  "v",
  "z",
];
const weights = [
  4, 8, 12, 16, 20, 23, 26, 29, 31, 33, 35, 37, 38, 39, 40, 41, 42, 43, 44, 45,
  46,
];
const weights2 = [
  4.3, 6.1, 9.1, 6.7, 6.3, 1.9, 2.0, 2.2, 2.0, 2.8, 6.0, 4.0, 0.01, 0.15, 0.77,
  0.15, 1.5, 2.4, 2.4, 0.98, 0.07,
];

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
  if (g.vowelCount == 5) return;
  if (g.letters.length == 9) return;
  let vowel = generateVowel(g.letters);
  let index = g.letters.length;
  g.letters.push(vowel);
  g.vowelCount++;
  io.emit("add-letter", vowel, index);
};

generateVowel = (letters, firstTry = true) => {
  let vowel = vowels[Math.floor(Math.random() * 5)];
  if (firstTry && letters.includes(vowel))
    vowel = generateVowel(letters, false);
  return vowel;
};

addConsonant = (room) => {
  let g = rooms.get(room);
  if (g.consonantCount == 6) return;
  if (g.letters.length == 9) return;
  let consonant = generateConsonant(g.letters);
  let index = g.letters.length;
  g.letters.push(consonant);
  g.consonantCount++;
  io.to(room).emit("add-letter", consonant, index);
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

submitWord = async (word, username, room) => {
  let g = rooms.get(room);
  if (!g) return;
  const score = await scoreWord(word, g.letters);
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
  if (!(await inDictionary(word))) return 0;

  return word.length;
};

inDictionary = async (word) => {
  if (process.env.NODE_ENV == "development") return true;
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

nextRound = (room) => {
  console.log("nextRound");
  let g = rooms.get(room);
  let turn = g.nextTurn();
  io.to(room).emit("clear-letters");
  io.to(room).emit("send-players", g.players);
  tellTurn(g, turn);
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
  let turn = g.add({ id: socket.id, username: username });
  console.log(turn);
  tellTurn(g, turn);
  console.log(turn);
  //leave the old room
  leaveRoom(socket, oldRoom);
  //send it back to client
  callback(true, room);
  io.to(socket.id).emit("set-game-state", g.letters, g.words);
  io.to(room).emit("send-players", g.players);
};

leaveRoom = (socket, room) => {
  socket.leave(room);
  let g = rooms.get(room);
  if (g) {
    let turn = g.remove(socket.id);
    if (g.players.length == 0) {
      rooms.delete(room);
      return;
    }
    tellTurn(g, turn);
  }
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
  socket.on("add-vowel", addVowel);
  socket.on("add-consonant", addConsonant);
  socket.on("submit-word", submitWord);
  socket.on("restart-letters", restartLetters);
  socket.on("game-state", (cb) => cb(g.letters, g.words));
  socket.on("join-game", (room, oldRoom, username, cb) =>
    joinRoom(socket, room, oldRoom, username, cb)
  );
  socket.on("next-round", nextRound);
  socket.on("disconnecting", (reason) => disconnect(socket, reason));
  //debug
  socket.on("print-all-rooms", printAllRooms);
  socket.on("print-room", printRoom);
  socket.on("print-players", printPlayers);
};

//export
//=====================================
module.exports = registerGameHandler;
