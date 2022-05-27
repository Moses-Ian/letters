// variables 
//====================================
let numberElArr = [];
for (let i = 0; i < 6; i++)
    numberElArr.push(document.querySelector(`#number${i}`));

let answerElArr = [];
for (let i = 0; i < 6; i++)
    answerElArr.push(document.querySelector(`#answer${i}`));
// track a final answer variable
let operationArr = [];

const randomNumberEl = document.querySelector('#random-number-value');

const answerSection = document.querySelector('#answer-section')

const smallNumberBtn = document.querySelector('#small-number-btn');
const largeNumberBtn = document.querySelector('#large-number-btn');

const checkAnswer = document.querySelector('#check-answer')

const numberSection = document.querySelector('#numbers-section');

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
const showOperation = document.querySelector('#show-operation')
const multiply = document.querySelector('#multiply');
const add = document.querySelector('#add');
const subtract = document.querySelector('#subtract');
const divide = document.querySelector('#divide');
const score = document.querySelector('#score');



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
        smallNumberBtn.style.display = 'none';
        largeNumberBtn.style.display = 'none';

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
    answerSection.style.display = 'block'
    targetBtn.style.display = 'none'
    numberSection.style.display = 'none'
    return randomNumber;

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

function addSymbol(button) {
    operationArr.push(button);
    console.log('something')
}

function showSymbols() {
    showOperation.textContent = operationArr.join(' ');
    console.log(operationArr.join(' '));
    console.log(operationArr.length);
    console.log(showOperation.textContent)
    if (operationArr.length === 11) {
        checkAnswer.style.display = 'block'
        operation.style.display = 'none'
        console.log('max array length')
    }
};

function calculateTotal() {
    // iterate over operationArr
    total = parseInt(operationArr[0])
    for (let i = 1; i < operationArr.length; i += 2) {
        if (operationArr[i] === "+") {
            total += parseInt(operationArr[i + 1])
        } else if (operationArr[i] === "-") {
            total -= parseInt(operationArr[i + 1])
        } else if (operationArr[i] === "*") {
            total = total * parseInt(operationArr[i + 1])
        } else if (operationArr[i] === "/") {
            total = total / parseInt(operationArr[i + 1])
        }
    }

    console.log(total);
    operation.style.display = 'none'
    scoreAnswer();
    return total;
}

function scoreAnswer() {
    console.log('scoreAnswer function was called')
    difference = randomNumber - total
    console.log(difference)
    if (difference === 0) {
        score.textContent = '10 points!'
    }
    if (difference >= 1 && difference <= 20) {
        score.textContent = '7 points!'
    }
   
    if (difference >= 21 && difference <= 40) {
        score.textContent = '5 points!'
    }
    if (difference >= 41 && difference <= 60) {
        score.textContent = '5 points!'
    }
    if (difference >= 0 && difference <= 999) {
        score.textContent = 'TEST SCORE!'
    }
}
// Listeners
//====================================


checkAnswer.addEventListener('click', calculateTotal);
smallNumberBtn.addEventListener('click', addSmallNumber);
largeNumberBtn.addEventListener('click', addLargeNumber);
targetBtn.addEventListener('click', getRandomNumber);
answer0.addEventListener('click', function (button) {
    operation.style.display = 'block'
    document.getElementById("answer0").disabled = true
    operationArr.push(answer0.textContent);
    console.log(operationArr)
    showSymbols();
});
answer1.addEventListener('click', function (button) {
    operation.style.display = 'block'
    document.getElementById("answer1").disabled = true
    operationArr.push(answer1.textContent);
    console.log(operationArr)
    showSymbols();
});
answer2.addEventListener('click', function (button) {
    operation.style.display = 'block'
    document.getElementById("answer2").disabled = true
    operationArr.push(answer2.textContent);
    console.log(operationArr)
    showSymbols();
});
answer3.addEventListener('click', function (button) {
    operation.style.display = 'block'
    document.getElementById("answer3").disabled = true
    operationArr.push(answer3.textContent);
    console.log(operationArr)
    showSymbols();
});
answer4.addEventListener('click', function (button) {
    operation.style.display = 'block'
    document.getElementById("answer4").disabled = true
    operationArr.push(answer4.textContent);
    console.log(operationArr)
    showSymbols();
});
answer5.addEventListener('click', function (button) {
    operation.style.display = 'block'
    document.getElementById("answer5").disabled = true
    operationArr.push(answer5.textContent);
    console.log(operationArr)
    showSymbols();
});

subtract.addEventListener('click', function (button) {
    operation.style.display = 'none'
    operationArr.push(subtract.textContent);
    console.log(operationArr)
    showSymbols();
});
add.addEventListener('click', function (button) {
    operation.style.display = 'none'
    operationArr.push(add.textContent);
    console.log(operationArr)
    showSymbols();
});
multiply.addEventListener('click', function (button) {
    operation.style.display = 'none'
    operationArr.push(multiply.textContent);
    console.log(operationArr)
    showSymbols();
});
divide.addEventListener('click', function (button) {
    operation.style.display = 'none'
    operationArr.push(divide.textContent);
    console.log(operationArr)
    showSymbols();
});







