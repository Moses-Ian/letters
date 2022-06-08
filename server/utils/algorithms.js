/*
Credit to http://www.maths-resources.com/countdown/ for the inspiration and some key ideas.

In 50000 trials, his algorithm took 54967 ms
In 50000 trials, mine took 134 ms

*/


const fs = require('fs');
const readline = require('readline');
// const dictionary = {
	// "a":{"a":{"a":{"d":{"k":{"r":{"r":{"s":{"v":{"words":["aardvarks"]}}}}}}},"d":{"f":{"l":{"o":{"r":{"w":{"words":["aardwolf"]}}}}},"e":{"l":{"o":{"r":{"s":{"v":{"w":{"words":["aardwolves"]}}}}}}}},"g":{"h":{"r":{"words":["aargh"]}}}},"d":{"e":{"n":{"words":["dean","dane"]}}}},
	// "e":{"e":{"l":{"r":{"t":{"t":{"words":["letter"]}}}}}}
// };	//for testing

let dictionary;
fs.readFile('./utils/dictionary_obj_5_to_9.txt', (err, data) => {
	if (err) throw err;
	dictionary = JSON.parse(data);
});

const lettersSolver = (letters, solutionLength) => {
	//we're going to start with finding the first in the alphabet, then move on from there
	const sorted = letters.sort().join('').toLowerCase().split('');
	
	let result;
	let check;
	do {
		result = solve(dictionary, sorted, solutionLength);
		// console.log(`${sorted.join('')} ${result}`);
		check = nextCombination(sorted, solutionLength);
	} while(!result && check !== null);
	
	if(result)
		return result;
	
	return null;
}

const solve = (node, letters, leftToGo) => {
	if(leftToGo === 0 && node.words) {
		return node.words[Math.floor(Math.random() * node.words.length)];
	}
	
	if (node[letters[0]]) {
		return solve(node[letters[0]], letters.slice(1), leftToGo-1);
	}
}

const nextCombination = (a, r) => {
	// console.log('start');
	// console.log(a.join(''));
	const n = a.length;
	//find the biggest element in r that is smaller than the biggest element out of r
	let i;
	for(i=0; i<r; i++) 
		if (a[i] >= a[n-1]) break;
	if (i == 0) return null;
	i--;
	//find the smallest lement out of r that is bigger than the above element
	let j;
	for(j=a.length-1; j>=r; j--) 
		if (a[j] <= a[i]) break;
	j++;
	const pivot2 = j;
	//swap them, and everything up to r
	while(i < r && j < n) {
		swap(a, i, j);
		i++;
		j++;
	}
	//if r didn't get reached, cleanup
	j--;
	while (i < r && j > pivot2) {
		swap(a, i, j);
		i++;
	}
	
	//make sure the end is sorted
	while (j < n-1 && a[j] > a[j+1]) {
		swap(a, j, j+1);
		j++;
	};
	
	// console.log('end');
}

const swap = (a, i, j) => {
	let temp = a[i];
	a[i] = a[j];
	a[j] = temp;
	// console.log(a.join(''));
}

module.exports = {
	lettersSolver,
	nextCombination
};