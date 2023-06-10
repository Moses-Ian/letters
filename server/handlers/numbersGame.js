const mexp = require('math-expression-evaluator');
const {useHint} = require('../schemas/serverResolvers');
const {numbersSolver} = require('../utils/algorithms');

// small numbers
const smallNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const AVAILABLE_SMALL_NUMBERS = 10;
// large numbers
const largeNumbers = ["25", "50", "75", "100"];
const AVAILABLE_LARGE_NUMBERS = 4;

addSmallNumber = (room) => {
  let g = rooms.get(room);
  if (g.smallNumberCount == 4) return;
	if (g.numberCount == 6) return;
  let number =
    smallNumbers[Math.floor(Math.random() * AVAILABLE_SMALL_NUMBERS)];
  if (addNumber(g, number)) g.smallNumberCount++;

  io.to(g.name).emit("add-number", number, g.numberCount);
  g.numberCount++;
	g.gameTimer.interrupt(ADDED_CHARACTER);
};

addLargeNumber = (room) => {
  let g = rooms.get(room);
  if (g.largeNumberCount == 4) return;
	if (g.numberCount == 6) return;
  let number =
    largeNumbers[Math.floor(Math.random() * AVAILABLE_LARGE_NUMBERS)];

  if (addNumber(g, number)) g.largeNumberCount++;
  io.to(g.name).emit("add-number", number, g.numberCount);
  g.numberCount++;
	g.gameTimer.interrupt(ADDED_CHARACTER);
};

const addNumber = (g, number) => {
  if (g.numberCount === 6) return false;
  g.numbers[g.numberCount] = number;
  return true;
};

getTargetNumber = (room) => {
  let g = rooms.get(room);
  if (g.numberCount == 6) {
    let randomNumber = Math.floor(Math.random() * (999 - 101)) + 101;
    g.target = randomNumber;
    io.to(g.name).emit("add-target", g.target);
  }
}

function calculateTotal(socket, operationArr, username, room) {
  let g = rooms.get(room);
	let total;
	let score;
	try {
		total = mexp.eval(operationArr.join(''));
		score = scoreAnswer(operationArr, total, g.target);
	} catch (err) {
		total = 0;
		score = 0;
	}
	g.getPlayer(username).addSubmission({ total, operationArr, username, score });
  g.operations.push({ total, operationArr, username, score });
  io.to(socket.id).emit("append-operations", total, operationArr, username, score);
}

function scoreAnswer(operationArr, total, target) {
	// total must be a whole number -> I'm not sure that we should include this rule, so I commented it out
	// if (Math.floor(total) !== total)
		// return 0;
	
	// verify that there are no adjacent numbers
	for(let i=1; i<operationArr.length; i++)
		if (parseInt(operationArr[i]) && parseInt(operationArr[i-1]))
			return 0;
		
	// score based on the distance
  let difference = Math.abs(target - total);
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

async function getNumbersHint(socket, username, room, jwt, cb) {
	let g = rooms.get(room);
	if (!g) return;
	//should await both sumiltaneously
	const [
		signedToken,
		{total, operationArr, score}
	] = await Promise.all([
		useHint(jwt),
		getHint(g.numbers, g.target)
	]);
	
	if (!signedToken) {
		cb(false);
		return;
	}
	
	if (score === 0) {
		cb(false);
		return;
	}
	g.getPlayer(username).addSubmission({ total, operationArr, username, score });
	g.operations.push({ total, operationArr, username, score });
	io.to(socket.id).emit('append-operations', total, operationArr, username, score);
	cb(signedToken);
};

async function getHint(numbers, target) {
	
	let operationArr = numbersSolver(numbers, target);

	if (operationArr.length === 0)
		return {score: 0};	//if the algorithm can't find a solution
	
	try {
		total = mexp.eval(operationArr.join(''));
		score = scoreAnswer(operationArr, total, target);
	} catch (err) {
		return {score: 0};
	}
	return {operationArr, total, score};
}


module.exports = {
	addSmallNumber,
	addLargeNumber,
	getTargetNumber,
	calculateTotal,
	getNumbersState,
	getNumbersHint
};