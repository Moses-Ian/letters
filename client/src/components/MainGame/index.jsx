import React, { useState, useEffect, useReducer } from "react";
import Timer from "../Timer";
import "bulma/css/bulma.min.css";

const MainGame = ({ socket, username, room }) => {
	// socket.emit('print-all-rooms');
	// socket.emit('print-players', room);
	// socket.emit('print-room', room);

  useEffect(() => {
    socket.on("add-letter", addLetter);
    socket.on("append-word", appendWord);
    socket.on("clear-letters", clearLetters);
    socket.on("set-game-state", setGameState);
    socket.on("your-turn", () => setTurn(true));

    return () => {
      socket.disconnect();
    };
  }, []);

  // variables
  const [lettersInput, setLettersInput] = useState("");
  const [inputState, inputDispatch] = useReducer(lettersInputReducer, "");

  const [letters, setLetters] = useReducer(
    letterReducer,
    new Array(9).fill("")
  );
  const [words, setWords] = useReducer(wordReducer, []);

  const [isYourTurn, setTurn] = useState(false);
  const [activeTimer, setActiveTimer] = useState(false);

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

  function lettersInputReducer(action) {
    let newInputState;
    switch (action.type) {
      case "CLEAR":
        newInputState = "";
        break;
      default:
        throw new Error();
    }
    return newInputState;
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
    const word = lettersInput;
    setLettersInput("");
    socket.emit("submit-word", word, username, room);
  };

  const restartLetters = (event) => {
    socket.emit("restart-letters", room);
  };

  const appendWord = (word, username, score) => {
    setWords({ type: "PUSH", word, username, score });
  };

  const clearLetters = () => {
    setLetters({ type: "CLEAR" });
    setWords({ type: "CLEAR" });

    setLettersInput("");
    setTurn(false);
  };

  const setGameState = (letters, words) => {
    setLetters({ type: "RENDER_LETTERS", letters });
    setWords({ type: "RENDER_WORDS", words });
  };

	console.log(letters);
	
  return (
    <div>
      <h1>You are playing in: {room}</h1>
      <h2>{isYourTurn ? "It is your turn" : "It is not your turn"}</h2>

      <div className="rendered-letters m-3">
        {letters.map((letter, index) => (
          <span className="letter-span" key={index}>
            {letter}
          </span>
        ))}
      </div>
      <div className="timer m-3">{activeTimer ? <Timer /> : <div></div>}</div>

      <div className="field m-3 has-text-centered">
        <button disabled={!isYourTurn || activeTimer} className="button mr-3 is-warning" onClick={addVowel}>
          Vowel
        </button>
        <button disabled={!isYourTurn || activeTimer} className="button is-warning" onClick={addConsonant}>
          Consonant
        </button>
      </div>

      <div className="field m-3">
        <form>
          <div className="field has-addons mt-3 is-justify-content-center">
            <div className="control">
              <input
                onChange={handleInputChange}
                className="input is-warning"
                type="text"
                placeholder="Your word here"
								value={lettersInput}
              />
            </div>

            <div className="control">
              <input
                className="button is-warning"
                type="submit"
                value="Submit"
                onClick={submitWord}
              />
            </div>
          </div>
        </form>
      </div>

      <div className="p-5">
        <ul>
          {words.map((word, index) => (
            <li key={index}>
              {word.username}: {word.word}: {word.score} points
            </li>
          ))}
        </ul>
      </div>

      <div className="m-3 has-text-centered">
        <button className="button is-warning m-2" onClick={restartLetters}>
          Restart
        </button>

        <button
          className="button is-warning m-2"
          onClick={() => socket.emit("next-round", room)}
        >
          Next Round
        </button>
      </div>
    </div>
  );
};

export default MainGame;
