import React from "react";
import ReactDOM from "react-dom";
import Confetti from "react-confetti";
import useWindowSize from "../../utils/useWindowSize";

// const winnerMessage = "WINNER!!";

function Winner({ usernames }) {
	const { width, height } = useWindowSize();
	
  return (
    <>
			<div className='confetti'>
				<Confetti 
					width={width}
					height={height}
				/>
			</div>
			{usernames.length === 1 
			?  (
				<h1 className="winner">{usernames[0]} Wins!!</h1>
			) : (
				<>
					<h1 className="winner">It's a Tie!!</h1>
					<h2 className="ties">{usernames.join('\n')}</h2>
				</>
			)}
    </>
  );
};

export default Winner;
