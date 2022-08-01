const mexp = require('math-expression-evaluator');
const POSSIBLE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 75, 100];

class Operations {
	constructor(operations, numbers, target) {
		this.operations = operations;
		this.numbers = numbers;
		this.target = target;
		this.f = Math.abs(target - mexp.eval(this.operations.join('')));
	}
	
	addNeighbors() {
		if (this.operations[this.operations.length-1] === '0') 
			return this.addNeighborsZero();
		this.neighbors = [];
		// add *8, etc
		for(let i=0; i<OPS.length; i++)
			for(let j=0; j<this.numbers.length; j++) {
				const neighbor = new Operations(
					[...this.operations, OPS[i], this.numbers[j]],
					[...this.numbers.slice(0, j), ...this.numbers.slice(j+1)],
					this.target
				);
				if (neighbor.f < this.target)
					this.neighbors.push(neighbor);
			}
		// add ( )
		for(let i=0; i<this.operations.length; i++) {
			if (!POSSIBLE_NUMBERS.includes(this.operations[i]))
				continue;
			if (i > 0 && this.operations[i-1] === '(')
				continue;
			for(let j=i+1; j<this.operations.length; j++) {
				if (!POSSIBLE_NUMBERS.includes(this.operations[j]))
					continue;
				const neighbor = new Operations(
					[...this.operations.slice(0,i), '(', ...this.operations.slice(i, j+1), ')', ...this.operations.slice(j+1)],
					[...this.numbers],
					this.target
				);
				if (neighbor.f < this.target)
					this.neighbors.push(neighbor);
			}
		}
		return this.neighbors;
	}
	
	addNeighborsZero() {
		this.neighbors = [];
		for(let i=0; i<this.numbers.length; i++)
			this.neighbors.push(new Operations(
				[this.numbers[i]],
				[...this.numbers.slice(0, i), ...this.numbers.slice(i+1)],
				this.target
			));
		return this.neighbors;
	}
	
	
}

module.exports = Operations;