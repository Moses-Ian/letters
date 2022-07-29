import React from "react";

const Header = ({ username, loggedIn, deleteToken }) => {
  return (
    <>
      <div className="is-flex is-justify-content-space-between">
        <h1 className="game-header">
          L<span className="game-header-3">3</span>tters
        </h1>

      </div>
      <div>
        <h1 className="welcome">Welcome, {username}!</h1>
      </div>
    </>
  );
};

export default Header;
