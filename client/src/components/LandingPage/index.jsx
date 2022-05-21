import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';



function LandingPage() {

    return (

        <div className='landing-page'>
            {/* PLACEHOLDER */}
            <h1 class="game-header">L<span class="game-header-3">3</span>tters</h1>
            {/* PLACEHOLDER */}
            
            <form className='login-form pt-6 '>
                <p className='sub-header mx-6'>Login:</p>
                <input className="input is-small mt-3 mx-6" type="email" placeholder="Email"></input>
                <input className="input is-small mt-3 mx-6" type="password" placeholder="Password"></input>
                <button className="button mt-3 mb-3 mx-6 is-warning">Enter</button>
            </form>
            
            
            
            <form className='register-form pt-6'>
                <p className='sub-header mx-6'>Register:</p>
                <input className="input is-small mt-3 mx-6" type="email" placeholder="Email"></input>
                <input className="input is-small mt-3 mx-6" type="password" placeholder="Password"></input>
                <input className="input is-small mt-3 mx-6" type="text" placeholder="Username"></input>
                <button className="button mt-3 mx-6 is-warning">Enter</button>
            </form>
            
        
           
            <div className='has-text-centered mt-6 pb-6'>
                <button className="button mt-3 mx-6 is-medium is-warning">Start Game</button>
                <button className="button mt-3 mx-6 is-medium is-warning">Join Game</button>
            </div>
           


        </div>

        
        
            
        
    )
}

export default LandingPage;