import React, { useState, useEffect, useReducer } from "react";
import Timer from "../Timer";
import "bulma/css/bulma.min.css";
import Auth from '../../utils/auth';

const NumbersGame = ({
  socket,
  username,
  room,
  activeTimer,
  setActiveTimer,
  isYourTurn,
  setTurn,
  score,
  setScore,
	loggedIn,
	jwt,
	dailyHints,
	setDailyHints,
	display
}) => {
  useEffect(() => {
    socket.emit("get-numbers-state", room, setGameState);
  }, []);
  useEffect(() => {
    socket.on("add-number", addNumber);
    socket.on("add-target", addTarget);
    socket.on("append-operations", scoreAnswer);
    // socket.on("your-turn", () => setTurn(true));
    return () => {};
  }, [socket]);

  // track a final answer variable
  const [operationArr, setOperationArr] = useReducer(operationReducer, []);

  const [numbersArr, setNumbersArr] = useReducer(numbersReducer, []);
  const [showAddNumberBtns, setShowAddNumberBtns] = useState(true);
  const [showTargetBtn, setShowTargetBtn] = useState(false);
  const [targetNumber, setTargetNumber] = useState(null);
  const [showAnswerBtn, setShowAnswerBtn] = useState(false);
  const [userTotal, setUserTotal] = useReducer(totalReducer, []);
  const [showNumberSection, setShowNumberSection] = useState(true);
  const [showOperationBtn, setShowOperationBtn] = useState(false);
  const [showCheckAnswerBtn, setShowCheckAnswerBtn] = useState(false);

  function operationReducer(operationArr, action) {
    let newOperation;
    switch (action.type) {
      case "PUSH":
        newOperation = [...operationArr, action.operation];
        break;
      case "CLEAR":
        newOperation = new Array(0).fill("");
        break;
      default:
        throw new Error();
    }
    return newOperation;
  }

  function numbersReducer(numbersArr, action) {
    let newNumbers;

    switch (action.type) {
      case "PUSH":
        const { numberObj, index } = action;
        newNumbers = [
          ...numbersArr.slice(0, index),
          numberObj,
          ...numbersArr.slice(index + 1),
        ];
        break;
      case "DISABLE":
        newNumbers = numbersArr;
        newNumbers[action.index].disabled = true;
        break;
      case "ENABLE":
        newNumbers = numbersArr;
        newNumbers[action.index].disabled = false;
        break;
      case "RENDER_NUMBERS":
        newNumbers = [...action.numbersArr];
        break;
      default:
        throw new Error();
    }
    return newNumbers;
  }

  function totalReducer(userTotal, action) {
    let newTotalArr;
    switch (action.type) {
      case "PUSH":
        const { total, operationArr, username, score } = action;
        newTotalArr = [...userTotal, { total, operationArr, username, score }];
        break;
      case "RENDER_TOTALS":
        newTotalArr = [...action.userTotal];
        break;
      default:
        throw new Error();
    }
    return newTotalArr;
  }

  // addSmallNumber
  const addSmallNumber = (event) => {
    socket.emit("add-small", room);
  };
  // addLargeNumber
  const addLargeNumber = (event) => {
    socket.emit("add-large", room);
  };

  // addNumber
  const addNumber = (number, index) => {
    if (index === 5) {
      setShowTargetBtn(true);
      setShowAddNumberBtns(false);
    }

    const action = {
      type: "PUSH",
      numberObj: {
        number,
        disabled: false,
      },
      index
    };
    setNumbersArr(action);
  };

  // generateNumber
  function getRandomNumber() {
    socket.emit("set-target", room);
    setActiveTimer(true);
  }

  function addTarget(target) {
    setTargetNumber(target);

    setShowAnswerBtn(true);
    setShowOperationBtn(true);
    setShowTargetBtn(false);
    setShowNumberSection(false);
    setShowCheckAnswerBtn(true);
  }

  function calculateTotal() {
    socket.emit("submit-calculation", operationArr, username, room);
    setShowCheckAnswerBtn(false);
  }

  function scoreAnswer(total, operationArr, username, score) {
    setUserTotal({ type: "PUSH", total, operationArr, username, score });
  }

  const answerFunction = (event) => {
    setShowOperationBtn(true);

    let text = event.target.innerText;
    let index = event.target.dataset.index;

    setNumbersArr({
      type: "DISABLE",
      index,
    });

    let action = {
      type: "PUSH",
      operation: text,
    };
    setOperationArr(action);
  };

  const operationSymbol = (event) => {
    let text = event.target.innerText;
    let action = {
      type: "PUSH",
      operation: text,
    };
    setOperationArr(action);
  };

  const backspace = (event) => {
    setOperationArr({ type: "CLEAR" });

    for (let index = 0; index < numbersArr.length; index++) {
      const element = numbersArr[index];
      setNumbersArr({
        type: "ENABLE",
        index,
      });
    }
  };

  const setGameState = (numbers, operations, target, numberCount) => {
    const numberObjects = numbers.map(number => {return {number, disabled: false}});
    setNumbersArr({ type: "RENDER_NUMBERS", numbersArr: numberObjects });
    if (numberCount === 6)
    setShowAddNumberBtns(false);

    setUserTotal({ type: "RENDER_TOTALS", userTotal: operations });
    if (target != 0)
    addTarget(target);
		console.log('setGameState in NumbersGame component');
  };

	const getHint = () => {
		socket.emit('get-numbers-hint', username, room, jwt, useHint);
	};
	
	const useHint = signedToken => {
		if (signedToken) {
			setDailyHints({type: "DECREMENT"});
			Auth.setToken(signedToken);
		}
		console.log('numbers solver not done yet');
	};
	
  return (
    <div className="is-flex is-flex-direction-column is-justify-content-center">
      <div className="target-number has-text-centered mt-4">
        <h1 id="random-number-value">{targetNumber}</h1>
      </div>
      <div className="timer">{activeTimer ? <Timer /> : ""}</div>
      <div className="numbers-generated has-text-centered" id="root">
        {showNumberSection ? (
          <div id="numbers-section rendered-letters column">
            <ul>
              {numbersArr.map((numberObj, index) => (
                <li className="letter-box" key={index}>
                  <span className="letter-span">{numberObj.number}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          ""
        )}
        {showAddNumberBtns ? (
          <>
            <div className="has-text-centered mt-4">
              <button
                className="button is-warning mr-2"
                id="small-number-btn"
                onClick={addSmallNumber}
              >
                Small Number
              </button>
              <button
                className="button is-warning"
                id="large-number-btn"
                onClick={addLargeNumber}
              >
                Large Number
              </button>
            </div>
          </>
        ) : (
          ""
        )}
        {showTargetBtn ? (
          <div className="has-text-centered">
            <button
              className="button is-warning mt-4"
              id="target"
              onClick={getRandomNumber}
            >
              Target
            </button>
          </div>
        ) : (
          ""
        )}

        {showAnswerBtn ? (
          <div id="answer-section">
            {numbersArr.map((numberObj, index) => (
              <button
                className="button mr-2"
                data-index={index}
                disabled={numberObj.disabled}
                key={index}
                onClick={answerFunction}
              >
                {numberObj.number}
              </button>
            ))}
          </div>
        ) : (
          ""
        )}

        {showOperationBtn ? (
          <div className="mt-4" id="operation">
            <button
              className="multiply-btn button is-warning mr-2"
              id=" multiply"
              onClick={operationSymbol}
            >
              *
            </button>
            <button
              className="subtract-btn button is-warning mr-2"
              id="subtract"
              onClick={operationSymbol}
            >
              -
            </button>
            <button
              className="divide-btn button is-warning mr-2"
              id="divide"
              onClick={operationSymbol}
            >
              /
            </button>
            <button
              className="add-btn button is-warning mr-2"
              id="add"
              onClick={operationSymbol}
            >
              +
            </button>
            <button
              className="l-parentheses-btn button is-warning mr-2"
              id="add"
              onClick={operationSymbol}
            >
              (
            </button>
            <button
              className="r-parentheses-btn button is-warning"
              id="add"
              onClick={operationSymbol}
            >
              )
            </button>
            <button
              className="button is-small is-warning ml-3 mt-1"
              id=" multiply"
              onClick={backspace}
            >
              Reset
            </button>
          </div>
        ) : (
          ""
        )}
        <div id="work">
          <h1 className="mt-4" id="show-operation">
            {operationArr.join(" ")}
          </h1>
          {userTotal.map((total, index) => (
            <li className='numbers-score' key={index}>
              {total.username}: {total.total}: {total.score} points
            </li>
          ))}
        </div>

        {showCheckAnswerBtn ? (
					<>
					<button
						className="button is-warning mb-6 mt-4"
						onClick={getHint}
						disabled={!(activeTimer && loggedIn) || dailyHints === 0}
					>
					{`${dailyHints} Hints`}
					</button>
          <button
            className="button is-warning mb-6 mt-4"
            id="check-answer"
            onClick={calculateTotal}
          >
            Submit Answer
          </button>
					</>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export default NumbersGame;
