const START = 0;
const SELECT = 1;
const ADD = 2;
const SUBMIT = 3;
const RESULTS = 4;
const END = 5;
const TARGET = 6;

const SIXTY_SECONDS = 1000;//60 * 1000;
const FIVE_SECONDS = 1000;//5 * 1000;
const THIRTY_SECONDS = 30 * 1000;
const SEVEN_SECONDS = 7 * 1000;

class GameTimer {
	constructor(room) {
		this.room = room;
		this.name = room.name;
		this.state = START;
		this.timeout;
	}
	
	start() {
		this.state = SELECT;
		this.timeout = setTimeout(() => this.addLetter(), SIXTY_SECONDS);
	}
	
	addLetter() {
		this.state = ADD;
		this.room.addRandom(this.name);
		if (this.room.letterCount === 9) {
			this.submit();
		} else if (this.room.numberCount === 6) {
			this.timeout = setTimeout(() => this.target(), FIVE_SECONDS);
		} else {
			this.timeout = setTimeout(() => this.addLetter(), FIVE_SECONDS);
		}
	}
	
	target() {
		getRandomNumber(this.name);
		this.submit();
	}
	
	submit() {
		this.state = SUBMIT;
		console.log('submit');
		this.timeout = setTimeout(() => this.results(), THIRTY_SECONDS);
	}
	
	results() {
		this.state = RESULTS;
		console.log('results');
		if (this.room.round === 6) {
			this.end();
		} else {
			this.timeout = setTimeout(() => this.start(), SEVEN_SECONDS);
		}
	}
	
	end() {
		this.state = END;
		console.log('end');
		// literally do nothing
	}
}

module.exports = GameTimer;
