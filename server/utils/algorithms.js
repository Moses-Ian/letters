/*
Credit to http://www.maths-resources.com/countdown/ for the inspiration and some key ideas.

In 50000 trials, his algorithm took 54967 ms
In 50000 trials, mine took 134 ms

*/
let dictionary = require('./dictionary_obj_5_to_9.json');
let Operations = require('./Operations');

// for testing with a smaller dictionary
// const dictionary = {
	// "a":{"a":{"a":{"d":{"k":{"r":{"r":{"s":{"v":{"words":["aardvarks"]}}}}}}},"d":{"f":{"l":{"o":{"r":{"w":{"words":["aardwolf"]}}}}},"e":{"l":{"o":{"r":{"s":{"v":{"w":{"words":["aardwolves"]}}}}}}}},"g":{"h":{"r":{"words":["aargh"]}}}},"d":{"e":{"n":{"words":["dean","dane"]}}}},
	// "e":{"e":{"l":{"r":{"t":{"t":{"words":["letter"]}}}}}}
// };

OPS = ['+', '-', '*', '/'];

const lettersSolver = (letters, solutionLength) => {
	
	//start with a random valid combination
	const sorted = getRandomCombination(letters, solutionLength);
	const start = sorted.map(a => a).join('');
	
	let result;
	let check;
	do {
		//see if this combination matches a word in the dictionary
		result = match(dictionary, sorted, solutionLength);
		// move on to the next one
		check = nextCombination(sorted, solutionLength);
	} while(!result && check !== null);
	
	//did we find a match? return it!
	if(result)
		return result;
	
	//well then loop around
	sorted.sort();
	do {
		result = match(dictionary, sorted, solutionLength);
		check = nextCombination(sorted, solutionLength);
	} while(!result && check != null && sorted.join('') < start);
	
	if(result)
		return result;

	//there are seriously no words of this length
	return null;
}

const match = (node, letters, leftToGo) => {
	if(leftToGo === 0 && node.words) {
		return node.words[Math.floor(Math.random() * node.words.length)];
	}
	
	if (node[letters[0]]) {
		return match(node[letters[0]], letters.slice(1), leftToGo-1);
	}
}

const nextCombination = (a, r) => {
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
}

const swap = (a, i, j) => {
	let temp = a[i];
	a[i] = a[j];
	a[j] = temp;
}

const getRandomCombination = (letters, solutionLength) => {
	// create deep copy
	let leftovers = [];
	for (let i=0; i<letters.length; i++)
		leftovers[i] = letters[i];
	// move random characters to character array
	let characters = [];
	for (let i=0; i<solutionLength; i++) {
		const random = Math.floor(Math.random() * leftovers.length);
		characters.push(leftovers.splice(random, 1));
	}
	//return it
	return characters.sort().concat(leftovers.sort());
}

// uses A* algorithm
const numbersSolver = (numbers, target) => {
	// the open set is stuff that needs to be explored
	let openSet = [];
	// the closed set is stuff that I have fully explored
	let closedSet = [];
	
	// get started
	let start = new Operations(['0'], numbers, target);
	openSet.push(start);

	// if you get within 60, you get points
	let end = 60;		
	
	while( openSet.length > 0) {
		// find the index with the lowest f
		let winner = 0;
		for (let i=0; i<openSet.length; i++) 
			if (openSet[i].f < openSet[winner].f)
				winner = i;
		
		// grab that set of operations
		let current = openSet[winner];
		
		// if this f is within our target, return it
		if (current.f <= end)
			return current.operations;
		
		// move it from the open set to the closed set
		openSet.splice(winner, 1);
		closedSet.push(current);
		
		// find it's neighboring operations
		let neighbors = current.addNeighbors();
		
		// for each neighbor...
		for (let i=0; i<neighbors.length; i++) {
			let neighbor = neighbors[i];
			
			// as long as they're not in either set, add them to the open set
			if (!inSet(closedSet, neighbor) && !inSet(openSet, neighbor))
				openSet.push(neighbor);
		}
	}
	
	// no solution
	return '';
}

// I somewhat crudely define 'being the same' as 'having the same f'
const inSet = (set, neighbor) => {
	for (let i=0; i<set.length; i++) 
		if (set[i].f === neighbor.f)
			return true;
	return false;
}

module.exports = {
	lettersSolver,
	getRandomCombination,
	dictionary,
	nextCombination,
	numbersSolver
};