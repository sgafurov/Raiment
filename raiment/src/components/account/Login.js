import React, { useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  let navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      )
      .then((res) => {
        // this dispatch is needed here. allows state to be updated before app.js can update it
        // dispatch(
        //   setUserInfo({
        //     username: res.user.displayName,
        //     email: res.user.email,
        //     isLoggedIn: true,
        //   })
        // );
        // localStorage.setItem(
        //   "userInfo",
        //   JSON.stringify({
        //     username: res.user.displayName,
        //     email: res.user.email,
        //     isLoggedIn: true,
        //   })
        // );
        navigate("/user-dashboard");
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  };

  return (
    <>
      <Form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" ref={emailRef} />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            ref={passwordRef}
          />
        </Form.Group>

        <Button variant="primary" type="submit" onClick={signIn}>
          Log in
        </Button>
      </Form>
      <Form.Label>
        <Button
          onClick={() => {
            navigate("/signup");
          }}
          style={{ background: "none", border: "none" }}
        >
          <span style={{ color: "black" }}>New user? Sign up</span>
        </Button>
      </Form.Label>
    </>
  );
}
