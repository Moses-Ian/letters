import React from "react";

const Header = ({ username, loggedIn, deleteToken }) => {
  return (
    <>
      <div className="is-flex is-justify-content-space-between">
        <h1 className="game-header">
          L<span className="game-header-3">3</span>tters
        </h1>

				{loggedIn &&
					<button
						className="modal-toggle-button is-warning mt-5"
						onClick={deleteToken}
					>
						Logout
					</button>
				}
      </div>
      <div>
        <h1 className="welcome">Welcome, {username}!</h1>
      </div>
    </>
  );
};

export default Header;
