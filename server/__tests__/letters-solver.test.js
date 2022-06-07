/*
To run this test, you must open algorithms.js and invert the comments on lines 30 and 31
*/


const {lettersSolver, pickCharacters,infile} = require('../utils/algorithms');

const letters = ['l','e','t','t','e','r'];
const letters2 = ['d','a','n','e'];
const letters3 = ['a','b','c','d','e','f','g','h','i'];

describe('letter solver algorithm', () => {
	test('picks six random characters', () => {
		const characters = pickCharacters(letters3, 6);
			
		expect(characters.length).toBe(6);
	});
	
	test('finds a six-letter word', () => {
		
		const word = lettersSolver(letters, 6);
		
		expect(word).toBe('letter');
	});
	
	test('finds a four-letter word', () => {
		
		const word = lettersSolver(letters2, 4);
		
		expect(word).toMatch(/(dane|dean)/);
	});
});