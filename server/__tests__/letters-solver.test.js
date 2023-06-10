/*
These tests are kind of janky. You need to edit the actual dictionary object in algorithms
*/

const {lettersSolver, nextCombination} = require('../utils/algorithms');

const letters = ['a','b','c','d','e','f','g','h','i'];
const letters2 = ['d','a','n','e'];
const letters3 = ['d','a','n','e', 'b'];
const letters4 = ['l','e','t','t','e','r','a','b','c'];

describe('next combination algoritm', () => {
	test('finds correct next combination', () => {
		const current = ['a','b','c','d','e'];
		const next = ['a','b','c','e','d'];
		
		nextCombination(current, 4);
		expect(current).toStrictEqual(next);
	});

	test('finds correct sequence of 5 choose 4', () => {
		const current = ['a','b','c','d','e'];
		
		nextCombination(current, 4);
		expect(current).toStrictEqual(['a','b','c','e','d']);
		nextCombination(current, 4);
		expect(current).toStrictEqual(['a','b','d','e','c']);
		nextCombination(current, 4);
		expect(current).toStrictEqual(['a','c','d','e','b']);
		nextCombination(current, 4);
		expect(current).toStrictEqual(['b','c','d','e','a']);
	});
	
	test('finds correct sequence of 6 choose 4', () => {
		const current = ['a','b','c','d','e', 'f'];
		
		nextCombination(current, 4);
		expect(current).toStrictEqual(['a','b','c','e','d','f']);
		nextCombination(current, 4);
		expect(current).toStrictEqual(['a','b','c','f','d','e']);
		nextCombination(current, 4);
		expect(current).toStrictEqual(['a','b','d','e','c','f']);
		nextCombination(current, 4);
		expect(current).toStrictEqual(['a','b','d','f','c','e']);
		nextCombination(current, 4);
		expect(current).toStrictEqual(['a','b','e','f','c','d']);
		nextCombination(current, 4);
		expect(current).toStrictEqual(['a','c','d','e','b','f']);
		nextCombination(current, 4);
		expect(current).toStrictEqual(['a','c','d','f','b','e']);
		nextCombination(current, 4);
		expect(current).toStrictEqual(['a','c','e','f','b','d']);
		nextCombination(current, 4);
		expect(current).toStrictEqual(['a','d','e','f','b','c']);
		nextCombination(current, 4);
		expect(current).toStrictEqual(['b','c','d','e','a','f']);
		nextCombination(current, 4);
		expect(current).toStrictEqual(['b','c','d','f','a','e']);
		nextCombination(current, 4);
		expect(current).toStrictEqual(['b','c','e','f','a','d']);
		nextCombination(current, 4);
		expect(current).toStrictEqual(['b','d','e','f','a','c']);
		nextCombination(current, 4);
		expect(current).toStrictEqual(['c','d','e','f','a','b']);

		const result = nextCombination(current, 4);
		expect(result).toBe(null);
	});

	test('finds correct sequence of 6 choose 3', () => {
		const current = ['a','b','c','d','e', 'f'];
		
		nextCombination(current, 3);
		expect(current).toStrictEqual('abdcef'.split(''));
		nextCombination(current, 3);
		expect(current).toStrictEqual('abecdf'.split(''));
		nextCombination(current, 3);
		expect(current).toStrictEqual('abfcde'.split(''));
		nextCombination(current, 3);
		expect(current).toStrictEqual('acdbef'.split(''));
		nextCombination(current, 3);
		expect(current).toStrictEqual('acebdf'.split(''));
		nextCombination(current, 3);
		expect(current).toStrictEqual('acfbde'.split(''));
		nextCombination(current, 3);
		expect(current).toStrictEqual('adebcf'.split(''));
		nextCombination(current, 3);
		expect(current).toStrictEqual('adfbce'.split(''));
		nextCombination(current, 3);
		expect(current).toStrictEqual('aefbcd'.split(''));
		nextCombination(current, 3);
		expect(current).toStrictEqual('bcdaef'.split(''));
		nextCombination(current, 3);
		expect(current).toStrictEqual('bceadf'.split(''));
		nextCombination(current, 3);
		expect(current).toStrictEqual('bcfade'.split(''));
		nextCombination(current, 3);
		expect(current).toStrictEqual('bdeacf'.split(''));
		nextCombination(current, 3);
		expect(current).toStrictEqual('bdface'.split(''));
		nextCombination(current, 3);
		expect(current).toStrictEqual('befacd'.split(''));
		nextCombination(current, 3);
		expect(current).toStrictEqual('cdeabf'.split(''));
		nextCombination(current, 3);
		expect(current).toStrictEqual('cdfabe'.split(''));
		nextCombination(current, 3);
		expect(current).toStrictEqual('cefabd'.split(''));
		nextCombination(current, 3);
		expect(current).toStrictEqual('defabc'.split(''));

		const result = nextCombination(current, 3);
		expect(result).toBe(null);
	});

	test('finds correct sequence of 9 choose 6 with duplicates', () => {
		const current = 'letterabc'.split('').sort();
		
		nextCombination(current, 6);
		expect(current).toStrictEqual('abceerltt'.split(''));
		nextCombination(current, 6);
		expect(current).toStrictEqual('abceetlrt'.split(''));
		nextCombination(current, 6);
		expect(current).toStrictEqual('abcelrett'.split(''));
		nextCombination(current, 6);
		expect(current).toStrictEqual('abceltert'.split(''));
		nextCombination(current, 6);
		expect(current).toStrictEqual('abcertelt'.split(''));
		nextCombination(current, 6);
		expect(current).toStrictEqual('abcettelr'.split(''));
		nextCombination(current, 6);
		expect(current).toStrictEqual('abclrteet'.split(''));
		// nextCombination(current, 6);
		// expect(current).toStrictEqual(''.split(''));
		// nextCombination(current, 6);
		// expect(current).toStrictEqual(''.split(''));
		// nextCombination(current, 6);
		// expect(current).toStrictEqual(''.split(''));
		// nextCombination(current, 6);
		// expect(current).toStrictEqual(''.split(''));
		// nextCombination(current, 6);
		// expect(current).toStrictEqual(''.split(''));
		// nextCombination(current, 6);
		// expect(current).toStrictEqual(''.split(''));
		// nextCombination(current, 6);
		
		//i really dont want to finish this test
	});
});

describe('letter solver algorithm', () => {
	test('finds a four-letter word', () => {
		
		const word = lettersSolver(letters2, 4);
		
		expect(word).toMatch(/(dane|dean)/);
	});

	test('searches for a four-letter word', () => {
		
		const word = lettersSolver(letters3, 4);
		
		expect(word).toMatch(/(dane|dean)/);
	});

	test('finds a six-letter word', () => {
		
		const word = lettersSolver(letters4, 6);
		
		expect(word).toBe('letter');
	});
	
});

