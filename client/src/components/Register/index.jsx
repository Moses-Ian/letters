import React, { useState } from 'react';
import Modal from '../Modal';
import '../../App.css';

//graphql
import { useMutation } from '@apollo/client';
import Auth from '../../utils/auth';
import { ADD_USER } from '../../utils/mutations';



export default function Register() {
    const [show, setShow] = useState(false)

		// Ian's cool graphql code
		//====================================================
		
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [addUser] = useMutation(ADD_USER);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
		console.log('sign up submit');
		console.log(formState);
    const mutationResponse = await addUser({
      variables: {
        email: formState.email,
        password: formState.password,
        username: formState.username,
      },
    });
		console.log(mutationResponse);
    const token = mutationResponse.data.addUser.token;
    Auth.login(token);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

		//====================================================

    return (
        <>

        <div className='Register'>
            <button className='sign-up-button' onClick={() => setShow(true) }> Sign Up </button>
              <form onSubmit={handleFormSubmit}>
                <Modal title='Sign up' onClose={() => setShow(false)} show={show}>
                    <div>
                        <input 
													className="type-box" 
													type="text" 
													placeholder="Username"
													name="username"
													onChange={handleChange}
												></input>
                    </div>
                    <div>
                        <input 
													className='type-box' 
													type="email" 
													placeholder="Email"
													name="email"
													onChange={handleChange}
												></input>
                    </div>
                    <div>
                        <input 
													className='type-box' 
													type="password" 
													placeholder="Password"
													name="password"
													onChange={handleChange}
												></input>
                    </div>
                </Modal>
              </form>
        </div>
        
        </>
    );
}