const START = 0;
const SELECT = 1;
const ADD = 2;
const SUBMIT = 3;
const RESULTS = 4;
const END = 5;
const TARGET = 6;

const SIXTY_SECONDS = 60 * 1000;
const FIVE_SECONDS = 5 * 1000;
const FORTY_FIVE_SECONDS = 45 * 1000;
const SEVEN_SECONDS = 7 * 1000;
const TWO_SECONDS = 2 * 1000;

// defining them like this makes them public
ADDED_CHARACTER = 0;
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
		this.clear();
    // console.log('start');
    // do nothing
  }

  select() {
    this.state = SELECT;
		this.clear();
    // console.log('select');
    this.timeout = setTimeout(() => this.add(), SIXTY_SECONDS);
  }

  add() {
    this.state = ADD;
		this.clear();
    // console.log('add');
    this.room.addRandom(this.name);
    if (this.room.letterCount === 9) {
      this.submit();
    } else if (this.room.numberCount === 6) {
      this.timeout = setTimeout(() => this.target(), TWO_SECONDS);
    } else {
      this.timeout = setTimeout(() => this.add(), FIVE_SECONDS);
    }
  }

  target() {
		this.state = TARGET;
		this.clear();
		// console.log('target');
    getTargetNumber(this.name);
    this.submit();
  }

  submit() {
    this.state = SUBMIT;
		this.clear();
    // console.log('submit');
    this.timeout = setTimeout(() => this.results(), FORTY_FIVE_SECONDS);
  }

  results() {
    this.state = RESULTS;
		this.clear();
    // console.log('results');
    updateScores(this.name);
    //if (this.room.round === 6) {	// for the demo, we will only do 5 rounds
    if (this.room.round === 5) {
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
		// this.clear();
    // console.log('end');
		nextRound(this.name);
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
		else if (code === ADDED_CHARACTER && this.room.numberCount === 6) {
			this.clear();
      this.timeout = setTimeout(() => this.target(), TWO_SECONDS);
		}
    else if (code === ADDED_CHARACTER && this.state === START) this.select();
    else if (code === NEXT_ROUND && this.state !== SELECT) {
      this.clear();
      this.start();
    }
  }
}

module.exports = GameTimer;
