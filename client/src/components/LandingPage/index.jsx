import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';



function LandingPage() {


    const [modalState, setModalState] = useState(false);

    // change state

    return (

        <div>
        <button class="js-modal-trigger" data-target="modal-login">
            LOGIN
        </button>

        <div class="modal-login">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Login</p>
                    <button class="delete" aria-label="close"></button>
                </header>
                <section class="modal-card-body">
                    
                    {/* Login  */}
                    <input className="input is-small mt-3" type="email" placeholder="Email"></input>
                    <input className="input is-small mt-3" type="password" placeholder="Password"></input>
                
           
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success is-primary">Login</button>
                    <button class="button is-warning">Cancel</button>
                </footer>
            </div>
        </div>
        </div>



        
        
            
        
    )
}

export default LandingPage;