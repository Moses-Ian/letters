import React, { useState, useEffect, useReducer } from "react";
import "bulma/css/bulma.min.css";

const NumbersGame = ({ socket, username, room }) => {
  useEffect(() => {
    socket.on("add-number", addNumber);
    socket.on("add-target", addTarget);
    socket.on("append-operations", scoreAnswer);
    // socket.on("your-turn", () => setTurn(true));
  }, [socket]);

  // track a final answer variable
  const [operationArr, setOperationArr] = useReducer(operationReducer, []);

  const [numbersArr, setNumbersArr] = useReducer(numbersReducer, []);
  const [showAddNumberBtns, setShowAddNumberBtns] = useState(true);
  const [showTargetBtn, setShowTargetBtn] = useState(false);
  const [targetNumber, setTargetNumber] = useState(null);
  const [showAnswerBtn, setShowAnswerBtn] = useState(false);
  //   const [userTotal, setUserTotal] = useState(0);
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
      default:
        throw new Error();
    }
    return newOperation;
  }

  function numbersReducer(numbersArr, action) {
    let newNumbers;
    switch (action.type) {
      case "PUSH":
        newNumbers = [...numbersArr, action.numberObj];
        break;
      case "DISABLE":
        newNumbers = numbersArr;
        newNumbers[action.index].disabled = true;
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
    };
    setNumbersArr(action);
  };

  // generateNumber
  function getRandomNumber() {
    socket.emit("set-target", room);
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
    // setUserScore(score);
    // setUserTotal(total);
    // console.log(username);
  }

  const answerFunction = (event) => {
    let text = event.target.innerText;
    setShowOperationBtn(true);
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
    // setShowOperationBtn(false);
    let action = {
      type: "PUSH",
      operation: text,
    };
    setOperationArr(action);
  };

  return (
    <>
      <div className="target-number has-text-centered mt-4">
        <h1 id="random-number-value">{targetNumber}</h1>
      </div>

      <div className="numbers-generated has-text-centered" id="root">
        {showNumberSection ? (
          <div id="numbers-section">
            {numbersArr.map((numberObj, index) => (
              <span className="numbers-divide" key={index}>
                {numberObj.number},
              </span>
            ))}
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
              className="button is-small is-warning mr-2"
              id=" multiply"
              onClick={operationSymbol}
            >
              *
            </button>
            <button
              className="button is-small is-warning mr-2"
              id="subtract"
              onClick={operationSymbol}
            >
              -
            </button>
            <button
              className="button is-small is-warning mr-2"
              id="divide"
              onClick={operationSymbol}
            >
              /
            </button>
            <button
              className="button is-small is-warning mr-2"
              id="add"
              onClick={operationSymbol}
            >
              +
            </button>
            <button
              className="button is-small is-warning mr-2"
              id="add"
              onClick={operationSymbol}
            >
              (
            </button>
            <button
              className="button is-small is-warning"
              id="add"
              onClick={operationSymbol}
            >
              )
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
          <button
            className="button is-warning mb-6 mt-4"
            id="check-answer"
            onClick={calculateTotal}
          >
            Check Answer
          </button>
        ) : (
          ""
        )}
      </div>
    </>
  );
};
export default NumbersGame;
