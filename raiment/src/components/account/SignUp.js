import React, { useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { login } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { getDatabase, ref, set, onValue, get } from "firebase/database";

export default function SignUp() {
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const usernameRef = useRef(null);

  function writeUserData(userId, username, email) {
    const db = getDatabase();
    set(ref(db, "users/" + username), {
      userId: userId,
      username: username,
      email: email,
    });
  }

  async function checkUsernameExists(username) {
    console.log("in checkUsernameExists function");
    const db = getDatabase();
    const userRef = ref(db, "users/" + username);

    try {
      const snapshot = await get(userRef);
      const data = snapshot.val();
      console.log("snapshot data", data);
      console.log("username we are comparing", username);
      console.log("are they equal?", data?.username === username);
      return data?.username === username;
    } catch (error) {
      console.error("Error retrieving data:", error);
      return false;
    }
  }

  const signUp = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    let username = usernameRef.current.value.trim().toLowerCase();
    username = username.replace(/[^a-zA-Z0-9]/g, "");
    console.log("updated username", username);

    const usernameExists = await checkUsernameExists(username);
    if (usernameExists === true) {
      alert("This username is already taken. Please choose another one");
      return;
    } else {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          updateProfile(res.user, { displayName: username });

          // this dispatch is needed here. allows state to be updated before app.js can update it
          dispatch(
            login({
              uid: res.user.uid,
              email: res.user.email,
              username: username,
            })
          );

          // add user to DB
          writeUserData(res.user.uid, username, res.user.email);
        })
        .catch((err) => {
          console.log(err);
          alert(err);
        });
    }
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
          <Form.Control
            type="email"
            placeholder="Enter email"
            ref={emailRef}
            required
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            ref={passwordRef}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            placeholder="Enter username"
            ref={usernameRef}
            required
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit" onClick={signUp}>
          Sign up
        </Button>
      </Form>
      <Form.Label>
        <Button
          onClick={() => {
            navigate("/login");
          }}
          style={{ background: "none", border: "none" }}
        >
          <span style={{ color: "black" }}>
            Already have an account? Log in
          </span>
        </Button>
      </Form.Label>
    </>
  );
}
