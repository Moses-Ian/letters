import React from "react";
import ReactDOM from "react-dom";
import Confetti from "react-confetti";
import useWindowSize from "../../utils/useWindowSize";

const L = ctx => ctx.fillText("L", 0, 5);
const THREE = ctx => ctx.fillText("3", 0, 5);
const T = ctx => ctx.fillText("T", 0, 5);
const R = ctx => ctx.fillText("R", 0, 5);
const E = ctx => ctx.fillText("E", 0, 5);
const S = ctx => ctx.fillText("S", 0, 5);
const rectangle = (ctx, w, h) => ctx.fillRect(-w, -h, w, h);

const shapes = [L, THREE, T, T, E, R, S, rectangle, rectangle, rectangle, rectangle, rectangle, rectangle];

function draw(ctx) {
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max-min) + min);
  }
  if (!this.newRan) {
		this.shape = getRandomInt(0, shapes.length);
		if (this.shape > 6) {
			this.w = getRandomInt(10, 30);
			this.h = getRandomInt(10, 30);
		}
    this.newRan = true;
  }
  ctx.font = "bold 30px 'Fugaz one'";
	shapes[this.shape](ctx, this.w, this.h);
}


function Winner({ usernames, width, height }) {
	
  return (
    <>
			<div className='confetti'>
				<Confetti 
					width={width}
					height={height}
          drawShape={draw}
					numberOfPieces={200}
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
