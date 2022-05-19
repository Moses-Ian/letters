//variables
//==================================
let io;

const vowels = ['a','e','i','o','u'];
const consonants = ['d','h','t','n','s','p','y','f','g','c','r','l','q','j','k','x','b','m','w','v','z'];
const weights =    [ 4 , 8 , 12, 16, 20, 23, 26, 29, 31, 33, 35, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

let letters = [];
let vowelCount = 0;
let consonantCount = 0;
let words = [];

//functions
//====================================
addVowel = () => {
	console.log("addVowel");
	if (vowelCount == 5)
		return;
	if (letters.length == 9)
		return;
	let vowel = vowels[Math.floor(Math.random() * 5)];
	let index = letters.length;
	letters.push(vowel);	
	vowelCount++;
	io.emit('add-letter', vowel, index);
};

addConsonant = () => {
	if (consonantCount == 6)
		return;
	if (letters.length == 9)
		return;
	let random = Math.floor(Math.random() * weights[20]);
	let consonant;
	for (let i=0; i<21; i++) {
		if (weights[i] > random) {
			consonant = consonants[i]
			break;
		}
	}
	let index = letters.length;
	letters.push(consonant);
	consonantCount++;
	io.emit('add-letter', consonant, index);
};

submitWord = word => {
	const score = scoreWord(word);
	words.push({ word, score });
	io.emit('append-word', word, score);
}

scoreWord = word => {
	let checklist = new Array(word.length);
	checklist.fill(false);
	
	//make sure every letter in the word is in letters
	for(let i=0; i<letters.length; i++)
		for(let j=0; j<word.length; j++)
			if (letters[i] === word[j] && !checklist[j]) {
				checklist[j] = true;
				break;
			}
	for(let j=0; j<checklist.length; j++)
		if (!checklist[j])
			return 0;
	
	//make sure it's in the dictionary
	if (!inDictionary(word))
		return 0;
	
	return word.length;
}

inDictionary = word => {
	//do something
	return true;
}

restartLetters = () => {
	letters = [];
	vowelCount = 0;
	consonantCount = 0;
	words = [];
	io.emit('clear-letters');
};

//listeners
//=====================================
const registerGameHandler = (newio, socket) => {
	console.log(socket.id);
	io = newio;
	socket.on('add-vowel', addVowel);
	socket.on('add-consonant', addConsonant);
	socket.on('submit-word', submitWord);
	socket.on('restart-letters', restartLetters);
	socket.on('game-state', cb => cb(letters, words));
}

//export
//=====================================
module.exports = registerGameHandler;