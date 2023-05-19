import Landing from "./components/landing/Landing";
import Login from "./components/account/login";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Products from "./components/Products";

function App() {
  return (
    <div className="App">
      <Router>
        <NavigationBar/>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/products" element={<Products />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
