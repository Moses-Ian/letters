import React from "react";
import ReactDOM from "react-dom";
import Confetti from "react-confetti";
// import useWindowSize from 'react-use/lib/useWindowSize'

// const winnerMessage = "WINNER!!";

// const { width, height } = useWindowSize()

const Winner = ({ username }) => {
  return (
    <>
      <div>
        <h1 className="winner">{username} Wins!!</h1>
          <Confetti />
            {/* width={width}
            height={height} */}
      </div>
    </>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<Winner />, rootElement);

export default Winner;
