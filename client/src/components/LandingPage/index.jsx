import React from "react";
import "../../App.css";
import Login from "../Login";
import Register from "../Register";

function LandingPage() {
  return (
		<div className="column">
			<Login />
			<Register />
			<div>
				<div className="center">
					<h1 className="landing-letters">
						L<span className="landing-letters-3">3</span>tters
					</h1>
				</div>
			</div>
		</div>
  );
}

export default LandingPage;
