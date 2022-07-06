import React from "react";
import "../../App.css";
import Login from "../Login";
import Register from "../Register";
import Footer from "../Footer";

function LandingPage({ saveToken }) {
  return (
    <>
      <div className="column">
        <Login saveToken={saveToken} />
        <Register saveToken={saveToken} />
        <div>
          <div className="center">
            <h1 className="landing-letters">
              L<span className="landing-letters-3">3</span>tters
            </h1>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LandingPage;
