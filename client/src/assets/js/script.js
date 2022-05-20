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

let lettersArr = [];
let vowelCount = 0;
let consonantCount = 0;

const vowels = ['a','e','i','o','u'];
const consonants = ['d','h','t','n','s','p','y','f','g','c','r','l','q','j','k','x','b','m','w','v','z'];
const weights =    [ 4 , 8 , 12, 16, 20, 23, 26, 29, 31, 33, 35, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];


//functions
//====================================
addVowel = event => {
	if (vowelCount == 5)
		return;
	let vowel = vowels[Math.floor(Math.random() * 5)];
	if (addLetter(vowel))
		vowelCount++;
};

addConsonant = event => {
	if (consonantCount == 6)
		return;
	let random = Math.floor(Math.random() * weights[20]);
	for (let i=0; i<21; i++) {
		if (weights[i] > random) {
			if (addLetter(consonants[i]))
				consonantCount++;
			break;
		}
	}
};

addLetter = letter => {
	if (lettersArr.length == 9)
		return false;
	letterElArr[lettersArr.length].textContent = letter.toUpperCase();
	lettersArr.push(letter);	
	return true;
}

submitWord = event => {
	event.preventDefault();
	const word = lettersInput.value;
	lettersInput.value = '';
	if (lettersArr.length != 9)
		return;
	const score = scoreWord(lettersArr, word);
	const wordEl = document.createElement('li');
	wordEl.textContent = `${word} -> ${score} points`;
	wordsEl.appendChild(wordEl);
}

scoreWord = (letters, word) => {
	let checklist = new Array(word.length);
	checklist.fill(false);
	
	for(let i=0; i<letters.length; i++)
		for(let j=0; j<word.length; j++)
			if (letters[i] === word[j] && !checklist[j]) {
				checklist[j] = true;
				break;
			}
	
	for(let j=0; j<checklist.length; j++)
		if (!checklist[j])
			return 0;
	
	if (!inDictionary(word))
		return 0;
	
	return word.length;
}

inDictionary = word => {
	//do something
	return true;
}

restartLetters = event => {
	lettersArr = [];
	vowelCount = 0;
	consonantCount = 0;
	for (let i=0; i<9; i++)
		letterElArr[i].textContent = '';
	wordsEl.innerHTML = '';
};



//listeners
//=====================================
vowelBtn.addEventListener('click', addVowel);
consonantBtn.addEventListener('click', addConsonant);
lettersForm.addEventListener('submit', submitWord);
lettersRestartBtn.addEventListener('click', restartLetters);








//body
//=====================================






















