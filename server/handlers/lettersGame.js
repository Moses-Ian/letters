const {lettersSolver} = require('../utils/algorithms');
const {appendFile} = require('fs');
const {useHint} = require('../schemas/serverResolvers');
const Filter = require('bad-words');
const filter = new Filter();

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
  4.3, 6.1, 9.1, 6.7, 6.3, 1.9, 2.0, 2.2, 2.0, 2.8, 6.0, 4.0, 0.01, 0.15, 0.77,
  0.15, 1.5, 2.4, 2.4, 0.98, 0.07,
];

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

addVowel = (room) => {
  let g = rooms.get(room);
  if (!g) return;
  if (g.vowelCount == 5) return;
  if (g.letterCount == 9) return;
  let vowel = generateVowel(g.letters);
  let index = g.letters.length;
  g.letters[g.letterCount] = vowel;
  g.vowelCount++;
  io.to(g.name).emit("add-letter", vowel, g.letterCount);
  g.letterCount++;
	g.gameTimer.interrupt(ADDED_CHARACTER);
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
  io.to(g.name).emit("add-letter", consonant, g.letterCount);
  g.letterCount++;
	g.gameTimer.interrupt(ADDED_CHARACTER);
};

generateConsonant = (letters, firstTry = true) => {
  let consonant;
  let random = Math.floor(Math.random() * 61.5);
  for (let i = 0; i < 21; i++) {
    if (weights[i] > random) {
      consonant = consonants[i];
      break;
    }
    random -= weights[i];
  }
  if (firstTry && letters.includes(consonant))
    consonant = generateConsonant(letters, false);
  return consonant;
};

submitWord = async (socket, word, username, room) => {
  let g = rooms.get(room);
  if (!g) return;
	if (isOffensive(word)) {
		io.to(socket.id).emit("bad-word");
		return;
	}
  const score = await scoreWord(word, g.letters);
	g.getPlayer(username).addSubmission({ word, username, score });
  g.words.push({ word, username, score });
	io.to(socket.id).emit("append-word", word, username, score);
};

scoreWord = async (word, letters) => {
	let score = 0;
	
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
	
	score = word.length;

	//word of the day
	if (word === WORD_OF_THE_DAY)
		score += 5;

  return score;
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
		return true;
  } catch (err) {
    console.error(err);
    return false;
  }
	return false;
};

isOffensive = (word) => {
	return filter.isProfane(word);
};

getLettersState = (room, cb) => {
  let g = rooms.get(room);
  if (!g) return;
  cb(g.letters, g.words)
};

getLettersHint = async (username, room, jwt, cb) => {
	let g = rooms.get(room);
	if (!g) return;
	// should await both simultaneously
	const [
		signedToken,
		{word, score}
	] = await Promise.all([
		useHint(jwt),
		recurseGetHint(g.letters)
	]);
	
	if (!signedToken) {
		cb(false);
		return;
	}
	g.getPlayer(username).addSubmission({ word, username, score });
	g.words.push({ username, word, score });
	io.to(g.name).emit("append-word", word, username, score);
	cb(signedToken);
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
	appendFile('../logs/invalid_words.log', `BadHint: ${word}`+'\n', 'utf-8', (err) => {console.log(err)});
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

module.exports = {
	addVowel,
	addConsonant,
	submitWord,
	getLettersState,
	getLettersHint
};