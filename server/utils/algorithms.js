// define the dictionary
const fs = require('fs');
const readline = require('readline');

// const infile = './ref/dictionary_sample.txt';
const infile = './utils/dictionary_5_to_9.txt';
let dictionary = {};


async function processLineByLine() {
	const fileStream = fs.createReadStream(infile);
	
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});
	
	for await (const line of rl) {
		const [sorted, word] = line.split(' ');
		
		if (!dictionary[sorted])
			dictionary[sorted] = [word];
		else
			dictionary[sorted].push(word);
	}
	
	// console.log(dictionary);
	return dictionary;
};

// to run the test, you must invert the comments on these two lines
processLineByLine();
// dictionary = {aden: ['dean', 'dane'], eelrtt: ['letter']};

const lettersSolver = (letters, solutionLength) => {
	//this is blocking. if it's a problem i'll deal with it later
	for(let attempt=1; attempt<=2; attempt++) {
		const attempt = lettersSolverAttempt(letters, solutionLength);
		if (attempt) return attempt;			
	}	
	return null;
}

const lettersSolverAttempt = (letters, solutionLength) => {
		//pick 6 random characters
		let characters = pickCharacters(letters, solutionLength);
		
		//sort them
		characters.sort();
		
		//get the elements from the dictionary
		const words = dictionary[characters.join('')];
		console.log(characters.join(''));
		
		//if it's in the dictionary, return it
		if (words) {
			const random = Math.floor(Math.random() * words.length);
			return words[random];
		}
		
		//otherwise, try again
		return null;
}

const pickCharacters = (letters, solutionLength) => {
	// create deep copy
	let characters = [];
	for (let i=0; i<letters.length; i++)
		characters[i] = letters[i];
	// delete random characters
	for (let i=characters.length - solutionLength; i > 0; i--) {
		const random = Math.floor(Math.random() * characters.length);
		characters.splice(random, 1);
	}
	//return it
	return characters;
}

module.exports = {
	lettersSolver,
	pickCharacters,
	dictionary
};