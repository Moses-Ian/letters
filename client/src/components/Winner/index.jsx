import React from "react";
import ReactDOM from "react-dom";
import Confetti from "react-confetti";
import useWindowSize from "../../utils/useWindowSize";


// const winnerMessage = "WINNER!!";


// TODO Change username to winnername or whatever to match the logic


const Winner = ({ username }) => {
const { width, height } = useWindowSize();
  return (
    <>
      <div>
        <h1 className="winner">{username} Wins!!</h1>
          <Confetti />
            width={width}
            height={height}
      </div>
    </>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<Winner />, rootElement);

export default Winner;
