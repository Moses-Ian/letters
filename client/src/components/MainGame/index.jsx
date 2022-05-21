import React, { useState } from "react";
import bricks from "../../assets/images/white-bricks.jpg";
import "bulma/css/bulma.min.css";

const MainGame = () => {
  //variables
  //==================================
  let letterElArr = [];
  for (let i = 0; i < 9; i++)
    letterElArr.push(document.querySelector(`#letter${i}`));
  // const vowelBtn = document.querySelector("#vowel");
  // const consonantBtn = document.querySelector("#consonant");
  // const lettersForm = document.querySelector("#letters-form");
  // FYI lettersInput was replaced with useState
  const lettersInput = document.querySelector("#letters-input");
  const wordsEl = document.querySelector("#words");
  // const lettersRestartBtn = document.querySelector("#letters-restart");

  // const [lettersInput, setLettersInput] = useState("");

  let lettersArr = [];
  let vowelCount = 0;
  let consonantCount = 0;

  const vowels = ["a", "e", "i", "o", "u"];
  const consonants = [
    "d",
    "h",
    "t",
    "n",
    "s",
    "p",
    "y",
    "f",
    "g",
    "c",
    "r",
    "l",
    "q",
    "j",
    "k",
    "x",
    "b",
    "m",
    "w",
    "v",
    "z",
  ];
  const weights = [
    4, 8, 12, 16, 20, 23, 26, 29, 31, 33, 35, 37, 38, 39, 40, 41, 42, 43, 44,
    45, 46,
  ];

  //functions
  //====================================
  const addVowel = (event) => {
    if (vowelCount === 5) return;
    let vowel = vowels[Math.floor(Math.random() * 5)];
    if (addLetter(vowel)) vowelCount++;
  };

  const addConsonant = (event) => {
    if (consonantCount === 6) return;
    let random = Math.floor(Math.random() * weights[20]);
    for (let i = 0; i < 21; i++) {
      if (weights[i] > random) {
        if (addLetter(consonants[i])) consonantCount++;
        break;
      }
    }
  };

  const addLetter = (letter) => {
    if (lettersArr.length === 9) return false;
    letterElArr[lettersArr.length].textContent = letter.toUpperCase();
    lettersArr.push(letter);
    return true;
  };

  const submitWord = (event) => {
    event.preventDefault();
    const word = lettersInput.value;
    lettersInput.value = "";
    if (lettersArr.length !== 9) return;
    const score = scoreWord(lettersArr, word);
    const wordEl = document.createElement("li");
    wordEl.textContent = `${word} -> ${score} points`;
    wordsEl.appendChild(wordEl);
  };

  const scoreWord = (letters, word) => {
    let checklist = new Array(word.length);
    checklist.fill(false);

    for (let i = 0; i < letters.length; i++)
      for (let j = 0; j < word.length; j++)
        if (letters[i] === word[j] && !checklist[j]) {
          checklist[j] = true;
          break;
        }

    for (let j = 0; j < checklist.length; j++) if (!checklist[j]) return 0;

    if (!inDictionary(word)) return 0;

    return word.length;
  };

  const inDictionary = (word) => {
    //do something
    return true;
  };

  const restartLetters = (event) => {
    lettersArr = [];
    vowelCount = 0;
    consonantCount = 0;
    for (let i = 0; i < 9; i++) letterElArr[i].textContent = "";
    wordsEl.innerHTML = "";
  };

  //listeners
  //=====================================
  // vowelBtn.addEventListener("click", addVowel);
  // consonantBtn.addEventListener("click", addConsonant);
  // lettersForm.addEventListener("submit", submitWord);
  // lettersRestartBtn.addEventListener("click", restartLetters);

  return (
    <div className="" id="letters-game">
      {/* <img className="background" src={bricks} alt="bricks" /> */}

      <div className="rendered-letters" id="scramble">
        <span id="letter0"></span>
        <span id="letter1"></span>
        <span id="letter2"></span>
        <span id="letter3"></span>
        <span id="letter4"></span>
        <span id="letter5"></span>
        <span id="letter6"></span>
        <span id="letter7"></span>
        <span id="letter8"></span>
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
        <ul id="words"></ul>
      </div>

      <div className="m-3">
        <button
          className="button has-background-grey-light is-fullwidth"
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
