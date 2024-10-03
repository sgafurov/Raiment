import Landing from "./components/landing/Landing";
import Login from "./components/account/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import { useEffect } from "react";
import { login, logout, selectUser } from "./store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import UserDashboard from "./components/account/UserDashboard";
import { auth } from "./firebase";
import CreateListing from "./components/listing/CreateListing";
import EditListing from "./components/listing/EditListing";
import Inbox from "./components/message/Inbox";
import BuyerChatBox from "./components/message/BuyerChatBox";
import SellerChatBox from "./components/message/SellerChatBox";
import SignUp from "./components/account/SignUp";
import "./styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Products from "./components/products/Products";
import AllProducts from "./components/products/AllProducts";
import SelectedProduct from "./components/products/SelectedProduct";



function App() {
  let dispatch = useDispatch();
  const user = useSelector(selectUser);

  const routes = [
    { path: "/", element: <Landing /> },
    { path: "/login", element: user ? <UserDashboard /> : <Login /> },
    { path: "/signup", element: user ? <UserDashboard /> : <SignUp /> },
    { path: "/user-dashboard", element: user ? <UserDashboard /> : <Login /> },
    { path: "/products/search/:userInput", element: <Products /> },
    { path: "/products/category/:category", element: <Products /> },
    // { path: "/products/:userInput", element: <Products /> },
    // { path: "/allproducts/:category", element: <AllProducts /> },
    { path: "/product/:params", element: <SelectedProduct /> },
    { path: "/upload", element: user ? <CreateListing /> : <Login /> },
    { path: "/edit-listing/:key", element: user ? <EditListing /> : <Login /> },
    { path: "/inbox", element: user ? <Inbox /> : <Login /> },
    { path: "/messageAsBuyer/:params", element: user ? <BuyerChatBox /> : <Login /> },
    { path: "/messageAsSeller/:params", element: user ? <SellerChatBox /> : <Login /> },
  ];

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
          {routes.map((route, index) => (
            <Route key={index} exact path={route.path} element={route.element} />
          ))}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
