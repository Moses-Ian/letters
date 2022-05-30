import React, { useState, useEffect, useReducer } from "react";
import Timer from "../Timer";
import "bulma/css/bulma.min.css";
import { set } from "mongoose";


const largeNumbers = ['25', '50', '75', '100'];


const NumbersGame = ({ socket, username, room }) => {
    // variables 
    //====================================
useEffect(() => {
socket.on('add-number', addNumber)


// socket.on("your-turn", () => setTurn(true));

},[]) 



    // track a final answer variable
    const [operationArr, setOperationArr] = useReducer(operationReducer, [])

    const [numbersArr, setNumbersArr] = useReducer(numbersReducer, [])



    const [smallNumberCount, setSmallNumberCount] = useState(0);
    const [largeNumberCount, setLargeNumberCount] = useState(0);

    const [showAddNumberBtns, setShowAddNumberBtns] = useState(true);

    const [showTargetBtn, setShowTargetBtn] = useState(false);
    const [targetNumber, setTargetNumber] = useState(null);
    const [total, setTotal] = useState(null);
    const [showAnswerBtn, setShowAnswerBtn] = useState(false);
    const [differenceNumber, setDifferenceNumber] = useState(null);

    const [showNumberSection, setShowNumberSection] = useState(true);
    const [showNumberDifference, setShowNumberDifference] = useState(false);

    const [showOperationBtn, setShowOperationBtn] = useState(false);
    const [disabledBtn, setDisabledBtn] = useReducer(disabledReducer, new Array(6).fill(false));
    const [showCheckAnswerBtn, setShowCheckAnswerBtn] = useState(false);
    const [score, setScore] = useState(0);


    function disabledReducer(disabledBtn, action) {

    }


    function operationReducer(operationArr, action) {
        let newOperation;
        switch (action.type) {
            case 'PUSH':
                newOperation = [...operationArr, action.operation]
                break;
            default:
                throw new Error();
        }
        return newOperation;
    };

    function numbersReducer(numbersArr, action) {
        let newNumbers;
        switch (action.type) {
            case 'PUSH':
                newNumbers = [...numbersArr, action.numberObj];
                break;
            case 'DISABLE':
                newNumbers = numbersArr;
                newNumbers[action.index].disabled = true;
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
        socket.emit('add-small', room);
    };
    // addLargeNumber
    const addLargeNumber = event => {
        socket.emit('add-large', room);

    };

    // addNumber
const addNumber = (number, index) => {
    console.log(number);
    if (index === 5) {
      setShowTargetBtn(true);
      setShowAddNumberBtns(false);
  }

  const action = {
      type: 'PUSH',
      numberObj: {
          number,
          disabled: false
      }
  }
  setNumbersArr(action);
}


    // generateNumber
    function getRandomNumber() {
        if (numbersArr.length == 6) {
            let randomNumber = Math.floor(Math.random() * (999 - 101)) + 101;
            setTargetNumber(randomNumber);
            
        }
        setShowAnswerBtn(true);
        setShowTargetBtn(false);
        setShowNumberSection(false);



    }

    

    // restartNumbers
   
    const restartNumbers = event => {
        // numbersArr = [];
        // smallNumberCount = 0;
        // largeNumberCount = 0;
        // for (let i = 0; i < 6; i++)
        //     numberElArr[i].textContent = '';
    };

    function showSymbols() {
        if (operationArr.length === 10) {
            setShowCheckAnswerBtn(true);
            setShowOperationBtn(false);
        }
        
    };

    function calculateTotal() {
        // iterate over operationArr
        
        
        let newTotal = parseInt(operationArr[0])
        for (let i = 1; i < operationArr.length; i += 2) {
                if (operationArr[i] === "+") {
                    newTotal += parseInt(operationArr[i + 1])
            setTotal(parseInt(operationArr[i + 1]));

                } else if (operationArr[i] === "-") {
                    newTotal -= parseInt(operationArr[i + 1])
                } else if (operationArr[i] === "*") {
                    newTotal = newTotal * parseInt(operationArr[i + 1])
                } else if (operationArr[i] === "/") {
                    newTotal = newTotal / parseInt(operationArr[i + 1])
                }
                
setTotal(newTotal);


        }
        setShowCheckAnswerBtn(false);
        setShowNumberDifference(true);
        

        scoreAnswer(newTotal);
        // return newTotal;
        
    }
    
    function scoreAnswer(total) {
        
        let difference = Math.abs(targetNumber - total)
        
        
        
        
        setDifferenceNumber(difference);
       
        if (difference === 0) {
        setScore(10)
        }
        else if  (difference >= 1 && difference <= 20) {
        setScore(7)
        }
        else if (difference >= 21 && difference <= 40) {
        setScore(5)
        }
        else if (difference >= 41 && difference <= 60) {
        setScore(2)
        }
        else (setScore(0))

    }


    const answerFunction = event => {
        let text = event.target.innerText
        setShowOperationBtn(true);
        let index = event.target.dataset.index;
        setNumbersArr({
            type: 'DISABLE',
            index
        })

        let action = {
            type: 'PUSH',
            operation: text
        }
        setOperationArr(action);

        showSymbols();
        
    };



    const operationSymbol = event => {
        let text = event.target.innerText
        setShowOperationBtn(false);
        let action = {
            type: 'PUSH',
            operation: text
        }
        setOperationArr(action);
        
        showSymbols();
    };

    
    

    return (
        <>
            <div>
                <h1 id="random-number-value">{targetNumber}</h1>
            </div>

            <div id="root">
                {showNumberSection ?
                    <div id='numbers-section'>
                        {numbersArr.map((numberObj, index) => (
                            <span key={index}>{numberObj.number}</span>
                        ))}

                    </div>
                    :
                    ''
                }
                {showAddNumberBtns ?
                    <>
                        <button id="small-number-btn" onClick={addSmallNumber}>Small Number</button>
                        <button id="large-number-btn" onClick={addLargeNumber}>Large Number</button>
                    </>
                    :
                    ''
                }
                {showTargetBtn
                    ? <button id="target" onClick={getRandomNumber}>Target</button>
                    :
                    ''
                }

                {showAnswerBtn ?
                    <div id='answer-section'>
                        {numbersArr.map((numberObj, index) => (
                            <button data-index={index} disabled={numberObj.disabled} key={index} onClick={answerFunction}>{numberObj.number}</button>
                        ))}
                    </div>
                    :
                    ''
                }

                {showOperationBtn ?
                    <div id='operation'>
                        <button id=" multiply" onClick={operationSymbol}>*</button>
                        <button id="subtract" onClick={operationSymbol}>-</button>
                        <button id="divide" onClick={operationSymbol}>/</button>
                        <button id="add" onClick={operationSymbol}>+</button>
                    </div>
                    :
                    ''
                }
                <div id="work">
                    <h1 id="show-operation">
                        {operationArr.join(' ')}
                    </h1>
                    <h1 id="score">
                    Score: {score} points!
                    </h1>
                    {showNumberDifference ?
                    <h1 id="number-difference">{differenceNumber +' away from target'}</h1>
                    :
                    ''
                }
                </div>

                {showCheckAnswerBtn ?
                    <button id="check-answer" onClick={calculateTotal}>Check Answer</button>
                    :
                    ''
                }
            </div>
        </>
    )


}
export default NumbersGame;