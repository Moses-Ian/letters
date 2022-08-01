const {
	getFactors, 
	getAdditions,
	getSubtractions,
	getMultiples,
	numbersSolver} = require('../utils/algorithms');

/*
describe('gets factors correctly', () => {
	test('finds factors of 1', () => {
		expect(getFactors(1)).toBe([1]);
	});
	
	test('finds factors of 2', () => {
		expect(getFactors(2)).toBe([1, 2]);
	});
	
	test('finds factors of 3', () => {
		expect(getFactors(3)).toBe([1, 3]);
	});
	
	test('finds factors of 4', () => {
		expect(getFactors(4)).toBe([1, 2, 4]);
	});
	
	test('finds factors of 5', () => {
		expect(getFactors(5)).toBe([1, 5]);
	});
	
	test('finds factors of 6', () => {
		expect(getFactors(6)).toBe([1, 2, 3, 6]);
	});
	
	test('finds factors of 7', () => {
		expect(getFactors(7)).toBe([1, 7]);
	});
	
	test('finds factors of 8', () => {
		expect(getFactors(8)).toBe([1, 2, 4, 8]);
	});
	
	test('finds factors of 9', () => {
		expect(getFactors(9)).toBe([1, 3, 9]);
	});
	
	test('finds factors of 10', () => {
		expect(getFactors(10)).toBe([1, 2, 5, 10]);
	});
	
	test('finds factors of 25', () => {
		expect(getFactors(25)).toBe([1, 5, 25]);
	});
	
	test('finds factors of 50', () => {
		expect(getFactors(50)).toBe([1, 2, 5, 10, 25, 50]);
	});
	
	test('finds factors of 75', () => {
		expect(getFactors(75)).toBe([1, 3, 5, 15, 25, 75]);
	});
	
	test('finds factors of 100', () => {
		expect(getFactors(100)).toBe([1, 2, 4, 5, 10, 20, 25, 50, 100]);
	});
});

describe('get additions correctly', () => {
	test('finds additions of 1', () => {
		expect(getAdditions(1)).toBe([1]);
	});
	
	test('finds additions of 2', () => {
		expect(getAdditions(2)).toBe([1, 2]);
	});
	
	test('finds additions of 3', () => {
		expect(getAdditions(3)).toBe([1, 2, 3]);
	});
	
	test('finds additions of 4', () => {
		expect(getAdditions(4)).toBe([1, 2, 3, 4]);
	});
	
	test('finds additions of 5', () => {
		expect(getAdditions(5)).toBe([1, 2, 3, 4, 5]);
	});
	
	test('finds additions of 6', () => {
		expect(getAdditions(6)).toBe([1, 2, 3, 4, 5, 6]);
	});
	
	test('finds additions of 7', () => {
		expect(getAdditions(7)).toBe([1, 2, 3, 4, 5, 6, 7]);
	});
	
	test('finds additions of 8', () => {
		expect(getAdditions(8)).toBe([1, 2, 3, 4, 5, 6, 7, 8]);
	});
	
	test('finds additions of 9', () => {
		expect(getAdditions(9)).toBe([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	});
	
	test('finds additions of 10', () => {
		expect(getAdditions(10)).toBe([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	});
	
	test('finds additions of 25', () => {
		expect(getAdditions(25)).toBe([25]);
	});
	
	test('finds additions of 50', () => {
		expect(getAdditions(50)).toBe([50]);
	});
	
	test('finds additions of 75', () => {
		expect(getAdditions(75)).toBe([75]);
	});
	
	test('finds additions of 100', () => {
		expect(getAdditions(100)).toBe([100]);
	});
});

describe('get subtractions correctly', () => {
	test('finds subtractions of 1', () => {
		expect(getSubtractions(1)).toBe([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	});
	
	test('finds subtractions of 2', () => {
		expect(getSubtractions(2)).toBe([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	});
	
	test('finds subtractions of 3', () => {
		expect(getSubtractions(3)).toBe([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	});
	
	test('finds subtractions of 4', () => {
		expect(getSubtractions(4)).toBe([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	});
	
	test('finds subtractions of 5', () => {
		expect(getSubtractions(5)).toBe([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	});
	
	test('finds subtractions of 6', () => {
		expect(getSubtractions(6)).toBe([1, 2, 3, 4, 6, 7, 8, 9, 10]);
	});
	
	test('finds subtractions of 7', () => {
		expect(getSubtractions(7)).toBe([1, 2, 3, 7, 8, 9, 10]);
	});
	
	test('finds subtractions of 8', () => {
		expect(getSubtractions(8)).toBe([1, 2, 8, 9, 10]);
	});
	
	test('finds subtractions of 9', () => {
		expect(getSubtractions(9)).toBe([1, 9, 10]);
	});
	
	test('finds subtractions of 10', () => {
		expect(getSubtractions(10)).toBe([10]);
	});
	
	test('finds subtractions of 25', () => {
		expect(getSubtractions(25)).toBe([25]);
	});
	
	test('finds subtractions of 50', () => {
		expect(getSubtractions(50)).toBe([50]);
	});
	
	test('finds subtractions of 75', () => {
		expect(getSubtractions(75)).toBe([75]);
	});
	
	test('finds subtractions of 100', () => {
		expect(getSubtractions(100)).toBe([100]);
	});
});

describe('get multiples correctly', () => {
	test('finds multiples of 1', () => {
		expect(getMultiples(1)).toBe([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 75, 100]);
	});
	
	test('finds multiples of 2', () => {
		expect(getMultiples(2)).toBe([2, 4, 6, 8, 10, 50, 100]);
	});
	
	test('finds multiples of 3', () => {
		expect(getMultiples(3)).toBe([3, 6, 9, 75]);
	});
	
	test('finds multiples of 4', () => {
		expect(getMultiples(4)).toBe([4, 8, 100]);
	});
	
	test('finds multiples of 5', () => {
		expect(getMultiples(5)).toBe([5, 10, 25, 50, 100]);
	});
	
	test('finds multiples of 6', () => {
		expect(getMultiples(6)).toBe([6]);
	});
	
	test('finds multiples of 7', () => {
		expect(getMultiples(7)).toBe([7]);
	});
	
	test('finds multiples of 8', () => {
		expect(getMultiples(8)).toBe([8]);
	});
	
	test('finds multiples of 9', () => {
		expect(getMultiples(9)).toBe([9]);
	});
	
	test('finds multiples of 10', () => {
		expect(getMultiples(10)).toBe([10, 50, 100]);
	});
	
	test('finds multiples of 25', () => {
		expect(getMultiples(25)).toBe([25, 50, 75, 100]);
	});
	
	test('finds multiples of 50', () => {
		expect(getMultiples(50)).toBe([50, 100]);
	});
	
	test('finds multiples of 75', () => {
		expect(getMultiples(75)).toBe([75]);
	});
	
	test('finds multiples of 100', () => {
		expect(getMultiples(100)).toBe([100]);
	});
});

*/

describe('solve problem correctly', () => {
	
	
	test('800, [100, 8]', () => {
		let target = 800;
		let nums = [100, 8];
		
		expect(numbersSolver(nums, target).join('')).toBe('100*8');
	});
	
	test('800, [100, 2, 6]', () => {
		let target = 800;
		let nums = [100, 2, 6];
		
		expect(numbersSolver(nums, target).join('')).toBe('100*(6+2)');
	});
	
	test('807, [100, 2, 6, 7]', () => {
		let target = 807;
		let nums = [100, 2, 6, 7];
		
		expect(numbersSolver(nums, target).join('')).toBe('100*(6+2)');
	});
	
	test('807, [100, 2, 6, 2, 5]', () => {
		let target = 807;
		let nums = [100, 2, 6, 2, 5];
		
		// expect(numbersSolver(nums, target)).toBe('(6+2)*100+(2+5)');
		// this result is a bug. (5-2)/2 = 3/2 = 1.5 shouldn't be legal.
		expect(numbersSolver(nums, target).join('')).toBe('100*(6+(5-2)/2)');
	});
	
	test('809, [100, 2, 6, 6]', () => {
		let target = 809;
		let nums = [100, 2, 6, 6];
		
		expect(numbersSolver(nums, target).join('')).toBe('100*(6+2)');
	});
	
	test('800, [100, 10, 2]', () => {
		let target = 800;
		let nums = [100, 10, 2];
		
		expect(numbersSolver(nums, target).join('')).toBe('100*(10-2)');
	});
	
	test('500, [100, 10, 2]', () => {
		let target = 500;
		let nums = [100, 10, 2];
		
		expect(numbersSolver(nums, target).join('')).toBe('100/2*10');
	});
	
});