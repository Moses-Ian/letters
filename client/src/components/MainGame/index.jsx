import React, { useState, useEffect, useReducer, useRef } from "react";
import Timer from "../Timer";
import MWlogo from "../../assets/images/Merriam-Webster.png";
import "bulma/css/bulma.min.css";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { sanitize } from "../../utils";
import { useL3ttersContext } from "../../utils/GlobalState";

const bestWord = words => {
	let bestIndex;
	let bestScore = 0;
	
	words.forEach((word, index) => {
		if (word.score > bestScore) {
			bestIndex = index;
			bestScore = word.score;
		}
	});
	
	return bestIndex;
};

const MainGame = ({
  activeTimer,
  setActiveTimer,
}) => {
  // socket.emit('print-all-rooms');
  // socket.emit('print-players', room);
  // socket.emit('print-room', room);
	
	const { 
		socket,
		username,
		room,
		isYourTurn,
		loggedIn,
		jwt,
		dailyHints,
		saveToken,
		display
	} = useL3ttersContext();
  
	useEffect(() => {
    socket.emit("get-letters-state", room, setGameState);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on("add-letter", addLetter);
    socket.on("append-word", appendWord);
    socket.on("clear-letters", clearLetters);
    socket.on("bad-word", badWord);

    //eslint-disable-next-line
  }, [socket]);

  // variables
  const [lettersInput, setLettersInput] = useState("");
  const [letters, setLetters] = useReducer(
    letterReducer,
    new Array(9).fill({ letter: "", disabled: false })
  );
  const [words, setWords] = useReducer(wordReducer, []);
  const [badWordMsg, setBadWordMsg] = useState(false);
	const [showLetterCards, setShowLetterCards] = useState(true);
	const [showLetterButtons, setShowLetterButtons] = useState(false);
  const elementRef = useRef();
  const inputRef = useRef();
	
	const highlightIndex = bestWord(words);

  useEffect(() => {
    if (isYourTurn) document.body.classList.add("your-turn");
    else document.body.classList.remove("your-turn");
  }, [isYourTurn]);

  useEffect(() => {
    if (display !== "active-view") return;
    elementRef.current.scrollIntoView({
      // behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
    //eslint-disable-next-line
  }, [words]);

  // functions
  function letterReducer(letters, action) {
    let newLetters;
    switch (action.type) {
      case "PUSH":
        const { letterObj, index } = action;
        newLetters = [
          ...letters.slice(0, index),
          letterObj,
          ...letters.slice(index + 1),
        ];
        break;
      case "CLEAR":
        newLetters = new Array(9).fill({ letter: "", disabled: false });
        break;
			case "DISABLE": 
				newLetters = letters;
				newLetters[action.index].disabled = true;
				break;
			case "ENABLE": 
				newLetters = letters;
				newLetters[action.index].disabled = false;
				break;
			case "ENABLE_ALL":
				newLetters = letters.map(letterObj => ({
					letter: letterObj.letter,
					disabled: false
				}));
				break;
      case "RENDER_LETTERS":
        newLetters = [...action.letters];
        break;
      default:
        throw new Error();
    }
    return newLetters;
  }

  function wordReducer(words, action) {
    let newWordsArr;
    switch (action.type) {
      case "PUSH":
        const { word, username, score } = action;
        newWordsArr = [...words, { word, username, score }];
        break;
      case "CLEAR":
        newWordsArr = [];
        break;
      case "RENDER_WORDS":
        newWordsArr = [...action.words];
        break;
      default:
        throw new Error();
    }
    return newWordsArr;
  }

  const addVowel = (event) => {
    socket.emit("add-vowel", room);
  };

  const addConsonant = (event) => {
    socket.emit("add-consonant", room);
  };

  const addLetter = (letter, index) => {
    setLetters({
      type: "PUSH",
      letterObj: {
				letter,
				disabled: false
			},
      index,
    });
    if (index === 8) {
      setActiveTimer("COUNTING");
			setShowLetterCards(false);
			setShowLetterButtons(true);
      // waits for the input to disable. if it is, then focus on it
      // setTimeout(() => {
        // if (inputRef.current) inputRef.current.focus();
      // }, 6);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setLettersInput(inputValue);
  };
	
	const selectLetter = (e) => {
		let text = e.target.innerText;
		let index = e.target.dataset.index;
		
		setLetters({
			type: "DISABLE",
			index
		});
		//i'm not sure about this
		setLettersInput(lettersInput.concat(text));
	};

  const submitWord = (event) => {
    event.preventDefault();
    const word = sanitize(lettersInput, { upper: true });
    setLettersInput("");
    if (word === "") return;
    socket.emit("submit-word", word, username, room);
    setLettersInput("");
    setBadWordMsg(false);
		setLetters({ type: "ENABLE_ALL" });
  };

  const appendWord = (submittedWord, submittedUser, submittedScore) => {
    setWords({
      type: "PUSH",
      word: submittedWord,
      username: submittedUser,
      score: submittedScore,
    });
  };

  const clearLetters = () => {
    setLetters({ type: "CLEAR" });
    setWords({ type: "CLEAR" });

    setLettersInput("");
    setActiveTimer("IDLE");
  };

  const setGameState = (letters, words) => {
    if (words.length === 0 && letters[0] === "") return;
    setLetters({ type: "RENDER_LETTERS", letters });
    setWords({ type: "RENDER_WORDS", words });
    if (letters[9] !== "") setActiveTimer("WAIT");
  };

  const badWord = () => {
    console.log("that is a bad word");
    setBadWordMsg(true);
  };

  const getHint = () => {
    socket.emit("get-letters-hint", username, room, jwt, useHint);
  };

  const useHint = (signedToken) => {
    if (signedToken) {
      saveToken(signedToken);
    }
  };
	
	console.log(letters);
	
  return (
    <div className="is-flex is-flex-direction-column is-justify-content-center">
			{showLetterCards && (
				<Tippy
					content="Click the buttons to select consonant and vowel letters to fill all the boxes. The longest valid word earns more points!"
					className="tippy"
				>
					<div className="rendered-letters column is-flex">
						{/* We do 2 here so that they can split on very small screens */}
						<ul className="is-flex is-justify-content-center">
							{letters.slice(0,5).map((letterObj, index) => (
								<li className="letter-box" key={index}>
									<span className="letter-span">{letterObj.letter}</span>
								</li>
							))}
						</ul>
						<ul className="letters-list is-flex is-justify-content-center">
							{letters.slice(5).map((letterObj, index) => (
								<li className="letter-box" key={index}>
									<span className="letter-span">{letterObj.letter}</span>
								</li>
							))}
						</ul>
					</div>
				</Tippy>
			)}

      <div className="timer">
        {(activeTimer === "COUNTING" || activeTimer === "DONE") && (
          <Timer setActiveTimer={setActiveTimer} />
        )}
        {activeTimer === "WAIT" && <p>Waiting for the next round...</p>}
      </div>

      <div className="field has-text-centered">
        <div
          className={
            "letters-buttons " +
            (activeTimer === "COUNTING" || activeTimer === "DONE"
              ? "hidden"
              : "")
          }
        >
          <button
            disabled={
              !isYourTurn ||
              activeTimer === "COUNTING" ||
              activeTimer === "DONE"
            }
            className="button mr-3 is-warning"
            onClick={addVowel}
          >
            Vowel
          </button>
          <button
            disabled={
              !isYourTurn ||
              activeTimer === "COUNTING" ||
              activeTimer === "DONE"
            }
            className="button is-warning"
            onClick={addConsonant}
          >
            Consonant
          </button>
        </div>
      </div>
			
			{showLetterButtons && (
				<div className="answer-section has-text-centered">
					{letters.map((letterObj, index) => (
						<button
							className="button m-1"
							data-index={index}
							disabled={letterObj.disabled}
							key={index}
							onClick={selectLetter}
						>
							{letterObj.letter}
						</button>
					))}
				</div>
			)}

      <div className="field">
        <form>
          <div className="letters-form-div field has-addons mt-2 is-flex is-justify-content-center is-align-items-center">
            <div className="control m-1">
              <input
                className="button is-warning"
                type="button"
                value={`${dailyHints} Hints`}
                disabled={
                  !(activeTimer === "COUNTING" && loggedIn) || dailyHints === 0
                }
                onClick={getHint}
              />
            </div>

            <div className="control m-1">
              <input
                onChange={handleInputChange}
                className="letters-input input is-warning"
                type="text"
                placeholder="Your word here"
                value={lettersInput}
                ref={inputRef}
                disabled={!(activeTimer === "COUNTING")}
              />
              {badWordMsg && (
                <p className="bad-word-msg mt-2">That is a bad word.</p>
              )}
            </div>

            <div className="control m-1">
              <input
                className="button is-warning"
                type="submit"
                value="Submit"
                disabled={!(activeTimer === "COUNTING")}
                onClick={submitWord}
              />
            </div>
          </div>
        </form>
      </div>

      <div className="words-list pl-2 mt-4">
        <ul className="word-list-items">
          {words.map((word, index) => (
            <li key={index} className={index === highlightIndex ? 'highlight-score' : ''}>
              {word.username}: {word.word}: {word.score} points
            </li>
          ))}
          <div ref={elementRef}></div>
        </ul>
      </div>

      <div className="mwlogo">
        <img src={MWlogo} alt="Merriam Webster Dictionary" />
      </div>
    </div>
  );
};

export default MainGame;
