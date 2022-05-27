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
                

                {/* <div className="bouncing-text">
                    <div className="l">L</div>
                    <div className="e1">3</div>
                    <div className="t1">t</div>
                    <div className="t">t</div>
                    <div className="e">e</div>
                    <div className="r">r</div>
                    <div className="s">s</div>
                    <div className="shadow"></div>
                    <div className="shadow-two"></div>
                </div> */}

              



            </div>
            <JoinGame />
        
            
        </>

    );
  }

  export default LandingPage;






