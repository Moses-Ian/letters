import React, { useState } from 'react';
import Modal from '../Modal';
// import 'bulma/css/bulma.min.css';



// MOVE TO LANDINGPAGE
export default function LandingPage() {
    const [show, setShow] = useState(false)
  
    return (
        <div> 
        
      <div className='LandingPage'>
        <button className='modal-toggle-button' onClick={() => setShow(true) }>Login</button>
        <Modal title='Login' onClose={() => setShow(false)} show={show}>
            <div>
                <input type="email" placeholder="Email"></input>
            </div>
            <div>
                <input type="password" placeholder="Password"></input>
            </div>
        </Modal>
      </div>


      {/* <div className='LandingPage'>
        <button onClick={() => setShow(true) }>Register</button>
        <Modal title='Login' onClose={() => setShow(false)} show={show}>
            <div>
                <input type="email" placeholder="Email"></input>
            </div>
            <div>
                <input type="password" placeholder="Password"></input>
            </div>
            
        </Modal>
      </div> */}

      </div>    
    )
  }

