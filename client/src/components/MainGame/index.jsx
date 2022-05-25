import React, { useState, useRef, useEffect, useReducer } from "react";
import "bulma/css/bulma.min.css";

const MainGame = ({ socket, room }) => {
  useEffect(() => {
    console.log("test #2");
    socket.on("add-letter", addLetter);
    socket.on("append-word", appendWord);
    socket.on("clear-letters", clearLetters);
    // socket.on("set-game-state", setGameState);

    return () => {
      socket.disconnect();
    };
  }, []);

  //variables
  //==================================
  const [lettersInput, setLettersInput] = useState("");

  const [letters, setLetters] = useReducer(letterReducer, []);
  const [words, setWords] = useReducer(wordReducer, []);

  function letterReducer(letters, action) {
    let newLetters;
    switch (action.type) {
      case "PUSH":
        newLetters = [...letters, action.letter];
        break;
      case "CLEAR":
        newLetters = [];
        break;
      case "RENDER_LETTERS":
        newLetters = [...action.letters];
        break;
      default:
        throw new Error();
    }
    console.log(newLetters);
    return newLetters;
  }

  function wordReducer(words, action) {
    let newWordsArr;
    switch (action.type) {
      case "PUSH":
        newWordsArr = [...words, { word: action.word, score: action.score }];
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
    console.log(newWordsArr);
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
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setLettersInput(inputValue);
  };

  const submitWord = (event) => {
    event.preventDefault();
    const word = lettersInput;
    setLettersInput("");
    socket.emit("submit-word", word, room);
  };

  const restartLetters = (event) => {
    socket.emit("restart-letters", room);
  };

  const appendWord = (word, score) => {
    console.log("append word");
    setWords({ type: "PUSH", word, score });
  };

  const clearLetters = () => {
    setLetters({ type: "CLEAR" });
    setWords({ type: "CLEAR" });
  };

  const setGameState = (letters, words) => {
    // clearLetters();

    setLetters({ type: "RENDER_LETTERS", letters });
    setWords({ type: "RENDER_WORDS", words });
  };

  return (
    <div className="" id="letters-game">
      <h1>{room}</h1>

      <div className="rendered-letters" id="scramble">
        {letters.map((letter, index) => (
          <span key={index}>{letter}</span>
        ))}
      </div>

      <div className="field m-3 is-flex">
        <button
          className="button mr-3 is-warning"
          id="vowel"
          onClick={addVowel}
        >
          Vowel
        </button>
        <button
          className="button is-warning"
          id="consonant"
          onClick={addConsonant}
        >
          Consonant
        </button>
      </div>

      <div className="field m-3">
        <form id="letters-form">
          <div className="field has-addons mt-3 is-justify-content-center">
            <div className="control">
              <input
                onChange={handleInputChange}
                className="input is-warning"
                type="text"
                placeholder="Your word here"
                id="letters-input"
              />
            </div>

            <div className="control is-flex">
              <input
                className="button is-warning"
                type="submit"
                id="letters-submit"
                value="Submit"
                onClick={submitWord}
              />
            </div>
          </div>
        </form>
      </div>

      <div className="p-5">
        <ul id="words">
          {words.map((word, index) => (
            <li key={index}>
              {word.word}: {word.score} points
            </li>
          ))}
        </ul>
      </div>

      <div className="m-3">
        <button
          className="button restart has-text-light is-fullwidth"
          id="letters-restart"
          onClick={restartLetters}
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default MainGame;
