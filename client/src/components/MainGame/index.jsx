import React from "react";

const MainGame = () => {
  return (
    <div className="main">
      {" "}
      <h1 className="game-header">
        L<span className="game-header-3">3</span>tters
      </h1>
      <div id="letters-game">
        <div id="scramble">
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

        <div className="container">
          <div className="vc-btn">
            <button id="vowel">Vowel</button>
            <button id="consonant">Consonant</button>
          </div>
        </div>

        <div className="container">
          <div className="submit-btn">
            <form id="letters-form">
              <input type="text" id="letters-input" />

              <div>
                <input type="submit" id="letters-submit" value="Submit" />
              </div>
            </form>
            <ul id="words"></ul>
          </div>
        </div>

        <div className="container">
          <div className="restart-btn">
            <button id="letters-restart">Restart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainGame;
