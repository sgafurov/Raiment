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
import { useDispatch } from "react-redux";

function App() {
  let dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      dispatch(setUserInfo(JSON.parse(localStorage.getItem("userInfo"))));
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
          <Route exact path="/products" element={<Products />} />
          <Route exact path="/upload" element={<Upload />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
