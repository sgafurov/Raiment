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
import userSlice, {
  setUserInfo,
  login,
  logout,
  selectUser,
} from "../src/store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import UserDashboard from "./components/UserDashboard";
import { auth } from "./firebase";

function App() {
  let dispatch = useDispatch();
  // const { username, email, isLoggedIn } = useSelector(
  //   (state) => state.userSlice
  // );

  const user = useSelector(selectUser);

  //check if user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        console.log(userAuth);
        dispatch(
          login({
            uid: userAuth.uid,
            email: userAuth.email,
            username: userAuth.displayName
          })
        );
      } else {
        dispatch(logout());
      }
    });
    return unsubscribe; // good practice. prevents memory leaks. unsubscribes and cleans up the listener when component unmounts
  }, [dispatch]);

  // useEffect(() => {
  //   if (localStorage.getItem("userInfo")) {
  //     dispatch(
  //       setUserInfo({
  //         username: localStorage.getItem("userInfo").username,
  //         email: localStorage.getItem("userInfo").email,
  //         isLoggedIn: true,
  //       })
  //     );
  //     console.log(
  //       "userSlice being updated from App.js level",
  //       username,
  //       email,
  //       isLoggedIn
  //     );
  //   }
  // }, []);

  return (
    <div className="App">
      <Router>
        <NavigationBar />
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route
            exact
            path="/login"
            element={user ? <UserDashboard /> : <Login />}
          />
          <Route
            exact
            path="/signup"
            element={user ? <UserDashboard /> : <SignUp />}
          />
          <Route
            exact
            path="/user-dashboard"
            element={user ? <UserDashboard /> : <Login />}
          />
          <Route
            exact
            path="/products"
            element={user ? <Products /> : <Login />}
          />
          <Route exact path="/upload" element={user ? <Upload /> : <Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
