//variables
//==================================
let letterElArr = [];
for (let i=0; i<9; i++)
	letterElArr.push(document.querySelector(`#letter${i}`));
const vowelBtn = document.querySelector('#vowel');
const consonantBtn = document.querySelector('#consonant');
const lettersForm = document.querySelector('#letters-form');
const lettersInput = document.querySelector('#letters-input');
const wordsEl = document.querySelector('#words');
const lettersRestartBtn = document.querySelector('#letters-restart');

//functions
//====================================
const connectFunction = socket => {
	socket.on('connect', () => {
		console.log(`You connected with id: ${socket.id}`);
	});
	socket.on('add-letter', addLetter);
	socket.on('append-word', appendWord);
	socket.on('clear-letters', clearLetters);
	socket.emit('game-state', setGameState);
};

const addVowel = event => {
	socket.emit('add-vowel');
};

const addConsonant = event => {
	socket.emit('add-consonant');
};

const submitWord = event => {
	event.preventDefault();
	const word = lettersInput.value;
	lettersInput.value = '';
	socket.emit('submit-word', word);
};

const restartLetters = event => {
	socket.emit('restart-letters');
};

const addLetter = (letter, index) => {
	letterElArr[index].textContent = letter.toUpperCase();
};

const appendWord = (word, score) => {
	const wordEl = document.createElement('li');
	wordEl.textContent = `${word} -> ${score} points`;
	wordsEl.appendChild(wordEl);	
};

const clearLetters = () => {
	for (let i=0; i<9; i++)
		letterElArr[i].textContent = '';
	wordsEl.innerHTML = '';
	
};

const setGameState = (letters, words) => {
	letters.forEach((letter, index) => addLetter(letter, index));
	words.forEach(({ word, score }) => appendWord(word, score));
};

//listeners
//=====================================
vowelBtn.addEventListener('click', addVowel);
consonantBtn.addEventListener('click', addConsonant);
lettersForm.addEventListener('submit', submitWord);
lettersRestartBtn.addEventListener('click', restartLetters);

//body
//=====================================
// let socket = io();	//front is same domain as server
let socket = io('http://localhost:3001');	//local
connectFunction(socket);
























