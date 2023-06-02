import React, { useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { setIsLoggedIn } from "../../store/userSlice";
import { useDispatch } from "react-redux";

export default function Login() {
  let dispatch = useDispatch();
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
        console.log(res);
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            isLoggedIn: true,
            username: res.user.displayName,
            email: res.user.email,
          })
        );
        dispatch(setIsLoggedIn(true));
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });

    navigate("/dashboard");
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

        <Button variant="primary" type="submit" onClick={signIn}>
          Submit
        </Button>
      </Form>
      <Form.Label>
        No account?{" "}
        <Button
          onClick={() => {
            navigate("/signup");
          }}
        >
          Sign up
        </Button>
      </Form.Label>
    </>
  );
}
