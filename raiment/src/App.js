import Landing from "./components/landing/Landing";
import Login from "./components/account/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Products from "./components/Products";
import SignUp from "./components/account/SignUp";
import { useEffect } from "react";
import { login, logout, selectUser } from "../src/store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import UserDashboard from "./components/UserDashboard";
import { auth } from "./firebase";
import CreateListing from "./components/listing/CreateListing";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  let dispatch = useDispatch();

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
            username: userAuth.displayName,
          })
        );
      } else {
        localStorage.clear();
        dispatch(logout());
      }
    });
    return unsubscribe; // good practice. prevents memory leaks. unsubscribes and cleans up the listener when component unmounts
  }, [dispatch]);

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
          <Route
            exact
            path="/upload"
            element={user ? <CreateListing /> : <Login />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
