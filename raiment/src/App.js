import Landing from "./components/landing/Landing";
import Login from "./components/account/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import { useEffect } from "react";
import { login, logout, selectUser } from "./store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import UserDashboard from "./components/UserDashboard";
import { auth } from "./firebase";
import CreateListing from "./components/listing/CreateListing";
import EditListing from "./components/listing/EditListing";
import Inbox from "./components/message/Inbox";
import BuyerChatBox from "./components/message/BuyerChatBox";
import SellerChatBox from "./components/message/SellerChatBox";
import SignUp from "./components/account/SignUp";
import "./styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Products from "./components/Products";
import AllProducts from "./components/AllProducts";
import SelectedProduct from "./components/SelectedProduct";

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
          <Route exact path="/products/:userInput" element={<Products />} />
          <Route
            exact
            path="/allproducts/:category"
            element={<AllProducts />}
          />

          <Route
            exact
            path="/products/:listingId"
            element={<SelectedProduct />}
          />

          <Route
            exact
            path="/upload"
            element={user ? <CreateListing /> : <Login />}
          />
          <Route
            exact
            path="/edit-listing/:key"
            element={user ? <EditListing /> : <Login />}
          />
          <Route exact path="/inbox" element={user ? <Inbox /> : <Login />} />
          <Route
            exact
            path="/messageAsBuyer/:params"
            element={user ? <BuyerChatBox /> : <Login />}
          />
          <Route
            exact
            path="/messageAsSeller/:params"
            element={user ? <SellerChatBox /> : <Login />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
