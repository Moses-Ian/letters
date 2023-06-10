import React, { useState } from "react";
import Modal from "../Modal";
import "../../App.css";
import { sanitize } from "../../utils";
import { useL3ttersContext } from "../../utils/GlobalState";

//graphql
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../utils/mutations";


export default function Login() {
	const { saveToken } = useL3ttersContext();
	
  const [show, setShow] = useState(false);
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [login] = useMutation(LOGIN);
  const [errorMsg, setErrorMsg] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const mutationResponse = await login({
        variables: {
          email: sanitize(formState.email, { lower: true }),
          password: formState.password,
        },
      });
      const token = mutationResponse.data.login.token;
			saveToken(token);
    } catch (e) {
      console.log(e);
      setErrorMsg(true);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
		<div className="Login">
			<button className="l3tters-btn modal-toggle-button" onClick={() => setShow(true)}>
				Login
			</button>

			{show &&
				<form onSubmit={handleFormSubmit}>
					<Modal title="Login" onClose={() => setShow(false)}>
						<div>
							<input
								autoFocus
								className="type-box input"
								type="email"
								placeholder="Email"
								name="email"
								onChange={handleChange}
								autoComplete="username"
							></input>
						</div>
						<div>
							<input
								className="type-box input"
								type="password"
								placeholder="Password"
								name="password"
								onChange={handleChange}
								autoComplete="current-password"
							></input>
							{errorMsg && 
								<div className="modal-error-msg">
									Please check your email and password
								</div>
							}
						</div>
					</Modal>
				</form>
			}
		</div>
  );
}
