import React, { useState, useEffect, useReducer } from "react";
import Timer from "../Timer";
import "bulma/css/bulma.min.css";
import { sanitize } from "../../utils";

const MainGame = ({
  socket,
  username,
  room,
  activeTimer,
  setActiveTimer,
  isYourTurn,
  setTurn,
  score,
  setScore,
	loggedIn
}) => {
  // socket.emit('print-all-rooms');
  // socket.emit('print-players', room);
  // socket.emit('print-room', room);

  useEffect(() => {
    socket.on("add-letter", addLetter);
    socket.on("append-word", appendWord);
    socket.on("clear-letters", clearLetters);
    socket.on("set-game-state", setGameState);
		socket.on("bad-word", badWord);

    return () => {};
  }, [socket]);

  // variables
  const [lettersInput, setLettersInput] = useState("");
  const [letters, setLetters] = useReducer(
    letterReducer,
    new Array(9).fill(" ")
  );
  const [words, setWords] = useReducer(wordReducer, []);
  const [badWordMsg, setBadWordMsg] = useState(false);

  useEffect(() => {
    if (isYourTurn) document.body.classList.add("your-turn");
    else document.body.classList.remove("your-turn");
  }, [isYourTurn]);

  // functions
  function letterReducer(letters, action) {
    let newLetters;
    switch (action.type) {
      case "PUSH":
        const { letter, index } = action;
        newLetters = [
          ...letters.slice(0, index),
          letter,
          ...letters.slice(index + 1),
        ];
        break;
      case "CLEAR":
        newLetters = new Array(9).fill("");
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
      letter,
      index,
    });
    if (index === 8) {
      setActiveTimer(true);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setLettersInput(inputValue);
  };

  const submitWord = (event) => {
    event.preventDefault();
    const word = sanitize(lettersInput, { upper: true });
    setLettersInput("");
    socket.emit("submit-word", word, username, room);
    setLettersInput("");
		setBadWordMsg(false);
  };

  const appendWord = (submittedWord, submittedUser, submittedScore) => {
    setWords({
      type: "PUSH",
      word: submittedWord,
      username: submittedUser,
      score: submittedScore,
    });
    if (submittedUser === username && submittedScore > score)
      setScore(submittedScore);
  };

  const clearLetters = () => {
    setLetters({ type: "CLEAR" });
    setWords({ type: "CLEAR" });

    setLettersInput("");
    setTurn(false);
    setActiveTimer(false);
  };

  const setGameState = (letters, words) => {
    setLetters({ type: "RENDER_LETTERS", letters });
    setWords({ type: "RENDER_WORDS", words });
  };
	
	const badWord = () => {
		console.log("that is a bad word");
		setBadWordMsg(true);
	};
	
	const getHint = () => {
		socket.emit('get-hint', username, room);
	};

  return (
    <>
      <div className="rendered-letters column">
        <ul>
          {letters.map((letter, index) => (
            <li className="letter-box" key={index}>
              <span className="letter-span">{letter}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="timer">{activeTimer ? <Timer /> : ""}</div>

      <div className="field has-text-centered">
        <div className={"letters-buttons " + (activeTimer ? "hidden" : "")}>
          <button
            disabled={!isYourTurn || activeTimer}
            className="button mr-3 is-warning"
            onClick={addVowel}
          >
            Vowel
          </button>
          <button
            disabled={!isYourTurn || activeTimer}
            className="button is-warning"
            onClick={addConsonant}
          >
            Consonant
          </button>
        </div>
      </div>

      <div className="field">
        <form>
          <div className="field has-addons mt-2 is-justify-content-center">
         
          <div className="control">
							<input
								className="hint-btn button is-warning pl-5"
								type="button"
								// value="Hint"
								disabled={!(activeTimer && loggedIn)}
								onClick={getHint}
							/>
						</div>

            <div className="control">
              <input
                onChange={handleInputChange}
                className="input is-warning"
                type="text"
                placeholder="Your word here"
                value={lettersInput}
              />
              {badWordMsg ? (
                <p className="bad-word-msg mt-2">
                  That is a bad word.
                </p>
              ) : (
                ""
              )}
            </div>

            <div className="control">
              <input
                className="button is-warning"
                type="submit"
                value="Submit"
                disabled={activeTimer ? false : true}
                onClick={submitWord}
              />
            </div>
					
          </div>
        </form>
      </div>

      <div className="words-list pl-2">
        <ul>
          {words.map((word, index) => (
            <li key={index}>
              {word.username}: {word.word}: {word.score} points
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MainGame;


