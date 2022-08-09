import React from "react";
import { useL3ttersContext } from "../../utils/GlobalState";


const Header = () => {
	const { username, loggedIn, deleteToken } = useL3ttersContext()
	
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
