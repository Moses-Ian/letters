import React, { useState } from 'react';
// import React from 'react';
import "./App.css";
import LandingPage from './components/LandingPage';
// import Modal from './components/Modal';



// MOVE TO LANDINGPAGE
// export default function App() {
//   const [show, setShow] = useState(false)

//   return (
//     <div className='App'>
//       <button onClick={() => setShow(true) }>Show Modal</button>
//       <Modal title='My Modal' onClose={() => setShow(false)} show={show}>
//         <p>Modal Body</p>
//       </Modal>
//     </div>
//   )
// }


function App() {
  
  return (
    <div className="App">

      {/* <button>Show Modal</button>
      <Modal /> */}
      <LandingPage />
       
     

    </div>
  );
}

export default App;