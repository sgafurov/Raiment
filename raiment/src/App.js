import Landing from "./components/landing/Landing";
import Login from "./components/account/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Products from "./components/Products";
import SignUp from "./components/account/SignUp";
import Upload from "./components/Upload";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { setUserInfo } from "../src/store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import UserDashboard from "./components/UserDashboard";

function App() {
  let dispatch = useDispatch();
  const { username, email, isLoggedIn } = useSelector(
    (state) => state.userSlice
  );

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      dispatch(
        setUserInfo({
          username: localStorage.getItem("userInfo").username,
          email: localStorage.getItem("userInfo").email,
          isLoggedIn: true
        })
      );
      console.log(
        "userSlice being updated from App.js level",
        username,
        email,
        isLoggedIn
      );
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <NavigationBar />
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/user-dashboard" element={<UserDashboard />} />
          <Route exact path="/products" element={<Products />} />
          <Route exact path="/upload" element={<Upload />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
