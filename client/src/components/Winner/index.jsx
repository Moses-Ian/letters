import React from "react";
import ReactDOM from "react-dom";
import Confetti from "react-confetti";


const winnerMessage = "WINNER!!";

function Winner() {
  return (
    <div className="winner">
      <h1>{winnerMessage}</h1>
      <Confetti />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Winner />, rootElement);

export default Winner;
