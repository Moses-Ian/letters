// variables 
//====================================
let numberElArr = [];
for (let i = 0; i < 6; i++)
    numberElArr.push(document.querySelector(`#number${i}`));

let answerElArr = [];
for (let i = 0; i < 6; i++)
    answerElArr.push(document.querySelector(`#answer${i}`));

let operationArr = [];
for (let i = 0; i < 6; i++)
    operationArr.push(document.querySelector(`#answer${i}`));

const randomNumberEl = document.querySelector('#random-number-value');

const answerSection = document.querySelector('#answer-section')

const smallNumberBtn = document.querySelector('#small-number-btn');
const largeNumberBtn = document.querySelector('#large-number-btn');

const targetBtn = document.querySelector('#target');
const numbersRestartBtn = document.querySelector('#restart');

//answers
const answer0 = document.querySelector('#answer0');
const answer1 = document.querySelector('#answer1');
const answer2 = document.querySelector('#answer2');
const answer3 = document.querySelector('#answer3');
const answer4 = document.querySelector('#answer4');
const answer5 = document.querySelector('#answer5');

//operations
const operation = document.querySelector('#operation')
const multiply = document.querySelector('#multiply');
const add = document.querySelector('#add');
const subtract = document.querySelector('#subtract');
const divide = document.querySelector('#divide');



let numbersArr = [];
let smallNumberCount = 0;
let largeNumberCount = 0;

// small numbers
const smallNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
// large numbers
const largeNumbers = ['25', '50', '75', '100'];
const weights = [4, 8, 12, 16]



// functions
//====================================
// addSmallNumber
// eslint-disable-next-line no-undef
addSmallNumber = event => {
    if (smallNumberCount == 4) {
        return;
    }
    let number = smallNumbers[Math.floor(Math.random() * 9)];
    if (addNumber(number)) {
        smallNumberCount++;
    }
};
// addLargeNumber
addLargeNumber = event => {
    if (largeNumberCount == 4) {
        return;
    }
    let random = Math.floor(Math.random() * weights[3]);
    for (let i = 0; i < 4; i++) {
        if (weights[i] > random) {
            if (addNumber(largeNumbers[i]))
                largeNumberCount++;
            break;
        }

    }
};

// addNumber

addNumber = number => {
    console.log(numbersArr.length)
    if (numbersArr.length === 6) {

        return false;

    }
    if (numbersArr.length === 5) {
        targetBtn.style.display = 'block';
        answerSection.style.display = 'block'
        

    }

    numberElArr[numbersArr.length].textContent = number
    answerElArr[numbersArr.length].textContent = number
    numbersArr.push(number);
    return true;
}

// generateNumber
function getRandomNumber() {
    if (numbersArr.length == 6) {
        randomNumber = Math.floor(Math.random() * (999 - 101)) + 101;
        randomNumberEl.textContent = randomNumber;
    }
}

// scoreNumber

// restartNumbers
// eslint-disable-next-line no-undef
restartNumbers = event => {
    numbersArr = [];
    smallNumberCount = 0;
    largeNumberCount = 0;
    for (let i = 0; i < 6; i++)
        numberElArr[i].textContent = '';
};

addSymbol = event => {
    operationArr.textContent = 'hello'
}
// Listeners
//====================================

smallNumberBtn.addEventListener('click', addSmallNumber);
largeNumberBtn.addEventListener('click', addLargeNumber);
targetBtn.addEventListener('click', getRandomNumber);
answer0.addEventListener('click', operationArr.push('1'))
console.log(operationArr)
