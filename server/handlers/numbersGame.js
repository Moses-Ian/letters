const mexp = require('math-expression-evaluator');

// small numbers
const smallNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const AVAILABLE_SMALL_NUMBERS = 9;
// large numbers
const largeNumbers = ["25", "50", "75", "100"];
const AVAILABLE_LARGE_NUMBERS = 4;

addSmallNumber = (room) => {
  let g = rooms.get(room);
  if (g.smallNumberCount == 4) return;
  let number =
    smallNumbers[Math.floor(Math.random() * AVAILABLE_SMALL_NUMBERS)];
  if (addNumber(g, number)) g.smallNumberCount++;

  io.to(room).emit("add-number", number, g.numberCount);
  g.numberCount++;
};

const addLargeNumber = (room) => {
  let g = rooms.get(room);
  if (g.largeNumberCount == 4) return;
  let number =
    largeNumbers[Math.floor(Math.random() * AVAILABLE_LARGE_NUMBERS)];

  if (addNumber(g, number)) g.largeNumberCount++;
  io.to(room).emit("add-number", number, g.numberCount);
  g.numberCount++;
};

const addNumber = (g, number) => {
  if (g.numberCount === 6) return false;
  g.numbers[g.numberCount] = number;
  return true;
};

function getRandomNumber(room) {
  let g = rooms.get(room);
  if (g.numberCount == 6) {
    let randomNumber = Math.floor(Math.random() * (999 - 101)) + 101;
    g.target = randomNumber;
    io.to(room).emit("add-target", g.target);
  }
}

function calculateTotal(operationArr, username, room) {
  let g = rooms.get(room);
	let total;
	let score;
	try {
		total = mexp.eval(operationArr.join(''));
		score = scoreAnswer(total, g);
	} catch (err) {
		total = 0;
		score = 0;
	}
		
	console.log(total);
  // let total = parseInt(operationArr[0]);

  // iterate over operationArr
  // for (let i = 1; i < operationArr.length; i += 2) {
    // if (operationArr[i] === "+") {
      // total += parseInt(operationArr[i + 1]);
    // } else if (operationArr[i] === "-") {
      // total -= parseInt(operationArr[i + 1]);
    // } else if (operationArr[i] === "*") {
      // total = total * parseInt(operationArr[i + 1]);
    // } else if (operationArr[i] === "/") {
      // total = total / parseInt(operationArr[i + 1]);
    // }
  // }

  g.operations.push({ total, operationArr, username, score });
  io.to(room).emit("append-operations", total, operationArr, username, score);
}

function scoreAnswer(total, g) {
  let difference = Math.abs(g.target - total);
  let score = 0;
  if (difference === 0) {
    score = 10;
  } else if (difference >= 1 && difference <= 20) {
    score = 7;
  } else if (difference >= 21 && difference <= 40) {
    score = 5;
  } else if (difference >= 41 && difference <= 60) {
    score = 2;
  } else score = 0;

  return score;
}

function getNumbersState(room, cb) {
  let g = rooms.get(room);
  if (!g) return;
  cb(g.numbers, g.operations, g.target, g.numberCount)
};


module.exports = {
	addSmallNumber,
	addLargeNumber,
	getRandomNumber,
	calculateTotal,
	getNumbersState
};