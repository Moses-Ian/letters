import React, { useState } from "react";
import Modal from "../Modal";
import "../../App.css";
import {sanitize} from '../../utils';

//graphql
import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import { LOGIN } from "../../utils/mutations";

export default function Login() {
  const [show, setShow] = useState(false);

  // Ian's cool graphql code
  //====================================================

  const [formState, setFormState] = useState({ email: "", password: "" });
  const [login, { error }] = useMutation(LOGIN);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const mutationResponse = await login({
        variables: { 
					email: sanitize(formState.email, {lower:true}), 
					password: formState.password 
				},
      });
      const token = mutationResponse.data.login.token;
      Auth.login(token);
    } catch (e) {
      console.log(e);
    }
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
      <div className="Login">
        <button className="modal-toggle-button" onClick={() => setShow(true)}>
          Login
        </button>

        <form onSubmit={handleFormSubmit}>
          <Modal title="Login" onClose={() => setShow(false)} show={show}>
            <div>
              <input
								autoFocus
                className="type-box input"
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
              ></input>
            </div>
            <div>
              <input
                className="type-box input"
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
