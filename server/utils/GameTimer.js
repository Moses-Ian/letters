const START = 0;
const SELECT = 1;
const ADD = 2;
const SUBMIT = 3;
const RESULTS = 4;
const END = 5;
const TARGET = 6;

const SIXTY_SECONDS = 60 * 1000;
const FIVE_SECONDS = 5 * 1000;
const THIRTY_SECONDS = 30 * 1000;
const SEVEN_SECONDS = 7 * 1000;

// defining them like this makes them public
ADDED_CHARACTER = 0;
SET_TARGET = 1;
NEXT_ROUND = 2;

class GameTimer {
	constructor(room) {
		this.room = room;
		this.name = room.name;
		this.state = START;
		this.timeout;
		this.start();
	}
	
	start() {
		this.state = START;
		// console.log('start');
		// do nothing
	}
	
	select() {
		this.state = SELECT;
		// console.log('select');
		this.timeout = setTimeout(() => this.add(), SIXTY_SECONDS);
	}
	
	add() {
		this.state = ADD;
		// console.log('add');
		this.room.addRandom(this.name);
		if (this.room.letterCount === 9) {
			this.submit();
		} else if (this.room.numberCount === 6) {
			this.timeout = setTimeout(() => this.target(), FIVE_SECONDS);
		} else {
			this.timeout = setTimeout(() => this.add(), FIVE_SECONDS);
		}
	}
	
	target() {
		getRandomNumber(this.name);
		this.submit();
	}
	
	submit() {
		this.state = SUBMIT;
		// console.log('submit');
		this.timeout = setTimeout(() => this.results(), THIRTY_SECONDS);
	}
	
	results() {
		this.state = RESULTS;
		// console.log('results');
		updateScores(this.name);
		if (this.room.round === 6) {
			this.timeout = setTimeout(() => this.end(), SEVEN_SECONDS);
		} else {
			this.timeout = setTimeout(() => {
				this.select();
				nextRound(this.name);
			}, SEVEN_SECONDS);
		}
	}
	
	end() {
		this.state = END;
		// console.log('end');
		// literally do nothing
	}
	
	clear() {
		clearTimeout(this.timeout);
	}
	
	interrupt(code) {
		// console.log(code);
		if (code === ADDED_CHARACTER && this.room.letterCount === 9) {
			this.clear();
			this.submit();
		}
		if (code === SET_TARGET) {
			this.clear();
			this.submit();
		}
		if (code === NEXT_ROUND && this.state !== SELECT) {
			this.clear();
			this.select();
		}
	}
}

module.exports = GameTimer;
