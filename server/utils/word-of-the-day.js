global.WORD_OF_THE_DAY = '';

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
const FIVE_SECONDS = 5 * 1000;

const updateWordOfTheDay = () => {
	let words = require('./words');
	let oldWord = WORD_OF_THE_DAY;
	do {
		WORD_OF_THE_DAY = words[Math.floor(Math.random() * words.length)];
	} while (WORD_OF_THE_DAY === oldWord);
};

updateWordOfTheDay();
setInterval(updateWordOfTheDay, TWENTY_FOUR_HOURS);