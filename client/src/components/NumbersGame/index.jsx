import React, { useState, useEffect, useReducer } from "react";
import Timer from "../Timer";
import "bulma/css/bulma.min.css";

// small numbers
const smallNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
// large numbers
const largeNumbers = ['25', '50', '75', '100'];
const weights = [4, 8, 12, 16]

const NumbersGame = ({ socket, username, room }) => {
    // variables 
    //====================================




    // track a final answer variable
    const [operationArr, setOperationArr] = useReducer(operationReducer, [])

    const [numbersArr, setNumbersArr] = useReducer(numbersReducer, [])

    const [smallNumberCount, setSmallNumberCount] = useState(0)
    const [largeNumberCount, setLargeNumberCount] = useState(0)
    const [showTargetBtn, setShowTargetBtn] = useState(false);

    function operationReducer(action) {
        return [];
    };

    function numbersReducer(numbersArr, action) {
        let newNumbers;
        switch (action.type) {
            case 'PUSH':
                newNumbers = [...numbersArr, action.number];
                break;
            default:
                throw new Error();
        }
        return newNumbers;
    };


    // functions
    //====================================
    // addSmallNumber
    const addSmallNumber = event => {
        if (smallNumberCount == 4) {
            return;
        }
        let number = smallNumbers[Math.floor(Math.random() * 9)];
        if (addNumber(number)) {
            setSmallNumberCount(smallNumberCount + 1);
        }
        console.log('addSmallNumber');
    };
    // addLargeNumber
    const addLargeNumber = event => {
        // if (largeNumberCount == 4) {
        //     return;
        // }
        // let random = Math.floor(Math.random() * weights[3]);
        // for (let i = 0; i < 4; i++) {
        //     if (weights[i] > random) {
        //         if (addNumber(largeNumbers[i]))
        //             largeNumberCount++;
        //         break;
        //     }

        // }
        console.log('addLargeNumber')
    };

    // addNumber

    const addNumber = number => {
        // console.log(numbersArr.length)
        if (numbersArr.length === 6) {

            return false;

        }
        if (numbersArr.length === 5) {

            setShowTargetBtn(true);
        }

        const action = {
            type: 'PUSH',
            number
        }
        setNumbersArr(action);
        return true;
    }

    // generateNumber
    function getRandomNumber() {
        // if (numbersArr.length == 6) {
        //     randomNumber = Math.floor(Math.random() * (999 - 101)) + 101;
        //     randomNumberEl.textContent = randomNumber;
        // }
        // answerSection.style.display = 'block'
        // targetBtn.style.display = 'none'
        // numberSection.style.display = 'none'
        // return randomNumber;
        console.log('getRandomNumber');

    }

    // scoreNumber

    // restartNumbers
    // eslint-disable-next-line no-undef
    const restartNumbers = event => {
        // numbersArr = [];
        // smallNumberCount = 0;
        // largeNumberCount = 0;
        // for (let i = 0; i < 6; i++)
        //     numberElArr[i].textContent = '';
    };

    function addSymbol(button) {
        // operationArr.push(button);
        // console.log('something')
        console.log('addSymbol');
    }

    function showSymbols() {
        // showOperation.textContent = operationArr.join(' ');
        // console.log(operationArr.join(' '));
        // console.log(operationArr.length);
        // console.log(showOperation.textContent)
        // if (operationArr.length === 11) {
        //     checkAnswer.style.display = 'block'
        //     operation.style.display = 'none'
        //     console.log('max array length')
        // }
        console.log('showSymbols')
    };

    function calculateTotal() {
        // iterate over operationArr
        // total = parseInt(operationArr[0])
        // for (let i = 1; i < operationArr.length; i += 2) {
        //     if (operationArr[i] === "+") {
        //         total += parseInt(operationArr[i + 1])
        //     } else if (operationArr[i] === "-") {
        //         total -= parseInt(operationArr[i + 1])
        //     } else if (operationArr[i] === "*") {
        //         total = total * parseInt(operationArr[i + 1])
        //     } else if (operationArr[i] === "/") {
        //         total = total / parseInt(operationArr[i + 1])
        //     }
        // }

        // console.log(total);
        // operation.style.display = 'none'
        // scoreAnswer();
        // return total;
        console.log('calculateTotal')
    }

    function scoreAnswer() {
        // console.log('scoreAnswer function was called')
        // difference = Math.abs(randomNumber - total)
        // numberDifference.textContent = difference + " away from target!"
        // console.log(difference)
        // if (difference === 0) {
        //     score.textContent = 'Score: 10 points!'
        // }
        // if (difference >= 1 && difference <= 20) {
        //     score.textContent = 'Score: 7 points!'
        // }
        // if (difference >= 21 && difference <= 40) {
        //     score.textContent = 'Score: 5 points!'
        // }
        // if (difference >= 41 && difference <= 60) {
        //     score.textContent = 'Score: 2 points!'
        // }
        // else (difference >= 0 && difference <= 999999999) 
        //     score.textContent = 'TEST SCORE!'

    }


    const answer0Function = button => {
        // operation.style.display = 'block'
        // document.getElementById("answer0").disabled = true
        // operationArr.push(answer0.textContent);
        // console.log(operationArr)
        // showSymbols();
        console.log('answer0Function')
    };

    const answer1Function = button => {
        // operation.style.display = 'block'
        // document.getElementById("answer1").disabled = true
        // operationArr.push(answer1.textContent);
        // console.log(operationArr)
        // showSymbols();
    };
    const answer2Function = button => {
        // operation.style.display = 'block'
        // document.getElementById("answer2").disabled = true
        // operationArr.push(answer2.textContent);
        // console.log(operationArr)
        // showSymbols();
    };
    const answer3Function = button => {
        // operation.style.display = 'block'
        // document.getElementById("answer3").disabled = true
        // operationArr.push(answer3.textContent);
        // console.log(operationArr)
        // showSymbols();
    };
    const answer4Function = button => {
        // operation.style.display = 'block'
        // document.getElementById("answer4").disabled = true
        // operationArr.push(answer4.textContent);
        // console.log(operationArr)
        // showSymbols();
    };
    const answer5Function = button => {
        // operation.style.display = 'block'
        // document.getElementById("answer5").disabled = true
        // operationArr.push(answer5.textContent);
        // console.log(operationArr)
        // showSymbols();
    };

    const subtractFunction = button => {
        // operation.style.display = 'none'
        // operationArr.push(subtract.textContent);
        // console.log(operationArr)
        // showSymbols();
    };
    const addFunction = button => {
        // operation.style.display = 'none'
        // operationArr.push(add.textContent);
        // console.log(operationArr)
        // showSymbols();
    };
    const multiplyFunction = button => {
        // operation.style.display = 'none'
        // operationArr.push(multiply.textContent);
        // console.log(operationArr)
        // showSymbols();
    };
    const divideFunction = button => {
        // operation.style.display = 'none'
        // operationArr.push(divide.textContent);
        // console.log(operationArr)
        // showSymbols();
    };

    console.log(smallNumberCount);
    console.log(numbersArr);

    return (
        <>
            <div>
                <h1 id="random-number-value"></h1>
            </div>
            <div id="root">
                <div id='numbers-section'>
                    {numbersArr.map(number => (
                        <span>{number}</span>
                    ))}

                </div>

                {showTargetBtn
                    ? <button id="target" onClick={getRandomNumber}>Target</button>
                    :
                    <>
                        <button id="small-number-btn" onClick={addSmallNumber}>Small Number</button>
                        <button id="large-number-btn" onClick={addLargeNumber}>Large Number</button>
                    </>
                }

                <div id='answer-section'>
                    {numbersArr.map(number => (
                        <button onClick={showSymbols}>{number}</button>
                    ))}


                </div>

                <div id='operation'>
                    <button id=" multiply" onClick={showSymbols}>*</button>
                    <button id="subtract" onClick={showSymbols}>-</button>
                    <button id="divide" onClick={showSymbols}>/</button>
                    <button id="add" onClick={showSymbols}>+</button>
                </div>

                <div id="work">
                    <h1 id="show-operation">
                    </h1>
                    <h1 id="score">
                    </h1>
                    <h1 id="number-difference"></h1>
                </div>

                <button id="check-answer" onClick={calculateTotal}>Check Answer</button>

            </div>
        </>
    )


}
export default NumbersGame;