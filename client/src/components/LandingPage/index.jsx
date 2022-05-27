import React from 'react';
import '../../App.css';
import JoinGame from '../JoinGame';
import Login from '../Login'

import Header from '../Header'

// import Register from '../Register'



function LandingPage() {

    return (
        <>
            <Login />
            <div className='container1'>
                <p className='landing-letters'>L<span className='landing-letters-3'>3</span>tters</p>
            </div>
            <JoinGame />

        </>
    );
  }

  export default LandingPage;






