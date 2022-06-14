import React from "react";
import ReactDOM from "react-dom";
import Confetti from "react-confetti";


// const winnerMessage = "WINNER!!";


// TODO Change username to winnername or whatever to match the logic


const Winner = ({ usernames }) => {
  return (
    <>
      <div>
			{usernames.length === 1 
			?  (
				<>
					<h1 className="winner">{usernames[0]} Wins!!</h1>
					<Confetti />
				</>
			) : (
				<>
					<h1 className="winner">It's a Tie!!</h1>
					<h2 className="ties">{usernames.join('\n')}</h2>
					<Confetti />
				</>
			)}
      </div>
    </>
  );
};

export default Winner;
