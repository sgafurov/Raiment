import React, { useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";

export default function SignUp() {
  let navigate = useNavigate();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const usernameRef = useRef(null);

  const signUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      )
      .then((res) => {
        updateProfile(res.user, { displayName: usernameRef.current.value });
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  };

  return (
    <>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" ref={emailRef} />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            ref={passwordRef}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            placeholder="Enter username"
            ref={usernameRef}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit" onClick={signUp}>
          Submit
        </Button>
      </Form>
      <Form.Label>
        Already have an account?
        <Button
          onClick={() => {
            navigate("/login");
          }}
        >
          Log in
        </Button>
      </Form.Label>
    </>
  );
}