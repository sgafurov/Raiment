import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
// import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Logo from "../images/logo.png";
import ProfileIcon from "../images/profile-icon.png";
import LogoutIcon from "../images/logout-icon.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { auth } from "../firebase";
import { selectUser } from "../store/userSlice";
import "../styles/navigationBar.css";
import { useNavigate } from "react-router-dom";

export default function NavigationBar() {
  const user = useSelector(selectUser);
  const [inputText, setInputText] = useState("");

  let navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    setInputText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/products/${inputText}`);
  };

  return (
    <Navbar bg="white" expand="lg" className="top-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={Logo} alt="Raiment" height={40} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/allproducts/Menswear">
              Menswear
            </Nav.Link>
            <Nav.Link as={Link} to="/allproducts/Womenswear">
              Womenswear
            </Nav.Link>
            <Nav.Link as={Link} to="/allproducts/Jewelry">
              Jewelry
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            placeholder="Search for items..."
            type="text"
            name="q"
            maxLength="2048"
            className="input-box"
            value={inputText}
            onChange={handleChange}
          />
        </form>
        
        <Navbar id="basic-navbar-nav">
          <Nav className="me-auto">
            {user ? (
              <>
                <Nav.Link as={Link} to="/upload">
                  Upload
                </Nav.Link>
                <Nav.Link as={Link} to="/user-dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/inbox">
                  Inbox
                </Nav.Link>
              </>
            ) : (
              <></>
            )}
          </Nav>
          {user ? (
            <div className="nav-buttons-logged-in">
              <Nav.Link
                as={Link}
                to="/"
                onClick={() => {
                  auth.signOut();
                }}
              >
                <img src={LogoutIcon} alt="Log out icon" height={30} />
              </Nav.Link>
            </div>
          ) : (
            <Nav.Link as={Link} to="/login">
              <img src={ProfileIcon} alt="Profile icon" height={70} />
            </Nav.Link>
          )}
        </Navbar>
      </Container>
    </Navbar>
  );
}
