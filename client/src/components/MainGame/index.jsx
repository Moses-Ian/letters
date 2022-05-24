import React, { useState, useRef, useEffect } from "react";
import "bulma/css/bulma.min.css";
import { io } from "socket.io-client";

const MainGame = (props) => {
  console.log(props);
  let socket = props.socket;
  let room = "My room";

  //variables
  //==================================
  let letterElArr = [];
  for (let i = 0; i < 9; i++)
    letterElArr.push(document.querySelector(`#letter${i}`));
  const lettersInput = useRef();
  const wordsEl = useRef();

  //functions
  //====================================

  const addVowel = (event) => {
    socket.emit("add-vowel", room);
  };

  const addConsonant = (event) => {
    socket.emit("add-consonant", room);
  };

  const submitWord = (event) => {
    event.preventDefault();
    const word = lettersInput.value;
    lettersInput.value = "";
    socket.emit("submit-word", word, room);
  };

  const restartLetters = (event) => {
    socket.emit("restart-letters", room);
  };

  const addLetter = (letter, index) => {
    letterElArr[index].textContent = letter.toUpperCase();
  };

  const appendWord = (word, score) => {
    const wordEl = document.createElement("li");
    wordEl.textContent = `${word} -> ${score} points`;
    wordsEl.appendChild(wordEl);
  };

  const clearLetters = () => {
    for (let i = 0; i < 9; i++) letterElArr[i].textContent = "";
    wordsEl.innerHTML = "";
  };

  const setGameState = (letters, words) => {
    clearLetters();
    letters.forEach((letter, index) => addLetter(letter, index));
    words.forEach(({ word, score }) => appendWord(word, score));
  };

  //body
  //=====================================

  // JOIN ROOM:
  const joinRoom = (name) => {
    console.log(props.socket);
    socket.emit("join-game", name, room, (success, newRoom) => {
      if (success) setRoom(newRoom);
    });
    console.log(`joinRoom ${name}`);
  };

  const setRoom = (newRoom) => {
    room = newRoom;
    // roomNameEl.textContent = room;
    localStorage.setItem("room", room);
  };

  const getRoom = () => {
    let r = localStorage.getItem("room");
    if (!r) return "Global Game";
    return r;
  };

  // joinRoom(getRoom());
  // {
  //   useEffect(() => joinRoom(room));
  // }

  return (
    <div className="" id="letters-game">
      <h1>{room}</h1>

      {/* {useEffect(() => joinRoom(room))} */}

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
                ref={lettersInput}
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
        <ul id="words" ref={wordsEl}></ul>
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
