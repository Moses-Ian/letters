import React from "react";
import Auth from "../../utils/auth";

const Header = ({ username }) => {
  return (
    <>
      <div className="is-flex is-justify-content-space-between">
        <h1 className="game-header">
          L<span className="game-header-3">3</span>tters
        </h1>

        <button
          className="modal-toggle-button button is-warning mt-4"
          onClick={() => Auth.logout()}
        >
          Logout
        </button>
      </div>
      <div>
        <h1 className="welcome">Welcome, {username}!</h1>
      </div>
    </>
  );
};

export default Header;
