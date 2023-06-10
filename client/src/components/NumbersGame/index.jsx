import React, { useState, useEffect, useReducer } from "react";
import Timer from "../Timer";
import "bulma/css/bulma.min.css";
import Tippy from "@tippyjs/react";
import { useL3ttersContext } from "../../utils/GlobalState";
import { cleanNumber } from "../../utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faXmark, faDivide, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';

const DEFAULT_NUMBERS = new Array(6).fill({ number: "", disabled: false });
const OPERATIONS = [
	{
		data: "+", 
		icon: faPlus
	}, {
		data: "-", 
		icon: faMinus
	}, {
		data: "*", 
		icon: faXmark
	}, {
		data: "/", 
		icon: faDivide
	}, {
		data: "(", 
		// the fontawesome brackets are pro icons
	}, {
		data: ")",
	}
];

const bestTotal = totals => {
	let bestIndex;
	let bestScore = 0;
	
	totals.forEach((total, index) => {
		if (total.score > bestScore) {
			bestIndex = index;
			bestScore = total.score;
		}
	});
	
	return bestIndex;
};

const NumbersGame = ({ activeTimer, setActiveTimer }) => {
  const {
    socket,
    username,
    room,
    isYourTurn,
    loggedIn,
    jwt,
    dailyHints,
    saveToken,
  } = useL3ttersContext();

  useEffect(() => {
    socket.emit("get-numbers-state", room, setGameState);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on("add-number", addNumber);
    socket.on("add-target", addTarget);
    socket.on("append-operations", scoreAnswer);
    // socket.on("your-turn", () => setTurn(true));

    //eslint-disable-next-line
  }, [socket]);

  // track a final answer variable
  const [operationArr, setOperationArr] = useReducer(operationReducer, []);

  const [numbersArr, setNumbersArr] = useReducer(
    numbersReducer,
    DEFAULT_NUMBERS
  );
  const [showAddNumberBtns, setShowAddNumberBtns] = useState(true);
  const [targetNumber, setTargetNumber] = useState(null);
  const [showAnswerBtn, setShowAnswerBtn] = useState(false);
  const [userTotal, setUserTotal] = useReducer(totalReducer, []);
  const [showNumberSection, setShowNumberSection] = useState(true);
  const [showOperationBtn, setShowOperationBtn] = useState(false);
  const [showCheckAnswerBtn, setShowCheckAnswerBtn] = useState(false);
	const [savedOperationArr, setSavedOperationArr] = useState([]);
	const [savedOperationIndexes, setSavedOperationIndexes] = useState([]);
	const [usedSavedOperation, setUsedSavedOperation] = useState(false);
	
	const highlightIndex = bestTotal(userTotal);

  function operationReducer(operationArr, action) {
    let newOperation;
    switch (action.type) {
      case "PUSH":
        newOperation = [...operationArr, action.operation];
        break;
			case "PUSH_ALL":
				newOperation = [...operationArr, '(', ...action.operation, ')'];
				break;
      case "CLEAR":
        newOperation = new Array(0).fill("");
        break;
			case "BACKSPACE":
				newOperation = operationArr.slice(0, -1);
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
      case "ENABLE_ALL":
        newNumbers = numbersArr.map((numberObj) => ({
          number: numberObj.number,
          disabled: false,
        }));
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
    if (index === 5) 
      setShowAddNumberBtns(false);

    const action = {
      type: "PUSH",
      numberObj: {
        number,
        disabled: false,
      },
      index,
    };
    setNumbersArr(action);
  };

  function addTarget(target) {
    setTargetNumber(target);

    setShowAnswerBtn(true);
    setShowOperationBtn(true);
    setShowNumberSection(false);
    setShowCheckAnswerBtn(true);
    setActiveTimer("COUNTING");
  }

  function calculateTotal() {
    socket.emit("submit-calculation", operationArr, username, room);
    // setShowCheckAnswerBtn(false);
    setNumbersArr({ type: "ENABLE_ALL" });
    setOperationArr({ type: "CLEAR" });
		setUsedSavedOperation(false);
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
    let text = event.currentTarget.dataset.symbol;
    let action = {
      type: "PUSH",
      operation: text,
    };
    setOperationArr(action);
  };

  const clear = (event) => {
    setOperationArr({ type: "CLEAR" });
    setNumbersArr({ type: "ENABLE_ALL" });
		setUsedSavedOperation(false);
  };
	
	const backspace = event => {
		// get the last item
		const deleted = operationArr.at(-1);
		
		// if the last item was in numbersArr, undisable it
		numbersArr.forEach((number, index) => {
			// eslint-disable-next-line
			if (number.disabled && number.number == deleted) {
				const action = {
					type: "ENABLE",
					index
				};
				setNumbersArr(action);
			}
		});
		
		// delete the last item
		const action = { type: "BACKSPACE" };
		setOperationArr(action);
	}

  const setGameState = (numbers, operations, target, numberCount) => {
    if (operations.length === 0 && numbers[0] === "") return;

    const numberObjects = numbers.map((number) => {
      return { number, disabled: false };
    });
    setNumbersArr({ type: "RENDER_NUMBERS", numbersArr: numberObjects });
    if (numberCount === 6) setShowAddNumberBtns(false);

    setUserTotal({ type: "RENDER_TOTALS", userTotal: operations });
    if (target !== 0) addTarget(target);

    if (numbers[5] !== "") setActiveTimer("WAIT");
  };

  const getHint = () => {
    socket.emit("get-numbers-hint", username, room, jwt, useHint);
  };

  const useHint = (signedToken) => {
    if (signedToken) {
      saveToken(signedToken);
    }
  };
	
	const save = () => {
		setSavedOperationArr(operationArr);
		setSavedOperationIndexes(numbersArr.reduce((list, number, index) => number.disabled ? [...list, index] : list, []));
		clear();
	};
	
	const disableSavedOperation = () => {
		// if there isn't anything saved, or if we used it -> disabled it
		if (savedOperationArr.length === 0 || usedSavedOperation)
			return true;
		
		// if we used any of the associated numbers -> disable it
		let disabled = false;
		savedOperationIndexes.forEach(savedIndex => {
			numbersArr.forEach((number, numberIndex) => {
				if (numberIndex === savedIndex && number.disabled)
					disabled = true;
			});
		});
		return disabled;
	}
	
	const useSavedOperationArr = () => {
		// add the saved stuff to the operations
		const action = {
			type: "PUSH_ALL",
			operation: savedOperationArr
		};
		setOperationArr(action);
		
		// flag that we used it
		setUsedSavedOperation(true);
		
		// disable the buttons that got used
		savedOperationIndexes.forEach(index => {
			const action = {
				type: "DISABLE",
				index
			};
			setNumbersArr(action);
		});
	}
	
  return (
    <div className="is-flex is-flex-direction-column is-justify-content-center">
      <div className="target-number has-text-centered mt-4">
        <h1>{targetNumber}</h1>
      </div>

      <div className="timer">
        {(activeTimer === "COUNTING" || activeTimer === "DONE") && (
          <Timer setActiveTimer={setActiveTimer} />
        )}
        {activeTimer === "WAIT" && <p>Waiting for the next round...</p>}
      </div>

      <div className="numbers-generated has-text-centered">
        {showNumberSection && (
          <Tippy content="Click the buttons to pick large or small numbers, then click 'Target' and try to reach it using simple math. The closer you get, the higher the score!">
            <div className="rendered-letters column is-flex">
							{/* We do 2 here so that they can split on very small screens */}
              <ul className="is-flex is-justify-content-center">
                {numbersArr.slice(0,3).map((numberObj, index) => (
                  <li className="letter-box number-box" key={index}>
                    <span
                      className={`letter-span ${
                        numberObj.number === "100" && "hundred"
                      }`}
                    >
                      {numberObj.number}
                    </span>
                  </li>
                ))}
              </ul>
              <ul className="is-flex is-justify-content-center">
                {numbersArr.slice(3).map((numberObj, index) => (
                  <li className="letter-box number-box" key={index}>
                    <span
                      className={`letter-span ${
                        numberObj.number === "100" && "hundred"
                      }`}
                    >
                      {numberObj.number}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Tippy>
        )}

        {showAddNumberBtns && (
          <>
            <div className="has-text-centered mt-2 is-flex is-flex-wrap-wrap is-justify-content-center is-align-content-space-between">
              <button
                className="button is-warning m-1"
                onClick={addSmallNumber}
                disabled={!isYourTurn}
              >
                Small Number
              </button>
              <button
                className="button is-warning m-1"
                onClick={addLargeNumber}
                disabled={!isYourTurn}
              >
                Large Number
              </button>
            </div>
          </>
        )}

        {showAnswerBtn && (
          <div className="answer-section">
            {numbersArr.map((numberObj, index) => (
              <button
                className="button m-1"
                data-index={index}
                disabled={numberObj.disabled}
                key={index}
                onClick={answerFunction}
              >
                {numberObj.number}
              </button>
            ))}
						{savedOperationArr.length !== 0 &&
							<button
								className="button m-1"
								disabled={disableSavedOperation()}
								onClick={useSavedOperationArr}
							>
								{savedOperationArr.join('')}
							</button>
						}
          </div>
        )}

        {showOperationBtn && (
          <div className="is-flex is-flex-wrap-wrap is-justify-content-center is-align-items-center mt-4">
						<div>
							{OPERATIONS.slice(0,4).map(op => (
								<button
									className="button is-warning m-1"
									onClick={operationSymbol}
									data-symbol={op.data}
									key={op.data}
								>
									<span className="icon">
										<FontAwesomeIcon className="fa-lg" icon={op.icon} />
									</span>
								</button>
							))}
						</div>
						<div>
							{OPERATIONS.slice(4).map(op => (
								<button
									className="button is-warning m-1"
									onClick={operationSymbol}
									data-symbol={op.data}
									key={op.data}
								>
									<span style={{fontSize: "1.33em"}}>{op.data}</span>
								</button>
							))}
						</div>
            <button
              className="button is-warning ml-4 m-1"
              onClick={backspace}
            >
              <span className="icon">
								<FontAwesomeIcon className="fa-lg" icon={faDeleteLeft} />
							</span>
            </button>
          </div>
        )}

        <div className="work">
          <h1 className="mt-4">
            {operationArr.join(" ")}
          </h1>
        </div>

        {showCheckAnswerBtn && (
          <>
            <button
              className="button is-warning mb-6 mt-4 mr-2"
              onClick={getHint}
              disabled={
                !(activeTimer === "COUNTING" && loggedIn) || dailyHints === 0
              }
            >
              {`${dailyHints} Hints`}
            </button>
            <button
              className="button is-warning mb-6 mt-4 mr-2"
              onClick={calculateTotal}
              disabled={!(activeTimer === "COUNTING")}
            >
              Submit Answer
            </button>
						<button
							className="button is-warning mb-6 mt-4"
							onClick={save}
							disabled={!(activeTimer === "COUNTING")}
						>
							Save
						</button>
          </>
        )}

				<div className="words-list pl-2 mt-4">
					<ul className="words-list-items">
						{userTotal.map((total, index) => (
							<li key={index} className={index === highlightIndex ? 'highlight-score' : ''}>
								{total.username}: {cleanNumber(total.total)}: {total.score} points
							</li>
						))}
					</ul>
				</div>
				
      </div>
    </div>
  );
};
export default NumbersGame;
