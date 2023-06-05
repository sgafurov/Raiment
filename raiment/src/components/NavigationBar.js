import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Logo from "../images/logo.png";
import ProfileIcon from "../images/profile-icon.png";
import LogoutIcon from "../images/logout-icon.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { auth } from "../firebase";
import { selectUser } from "../store/userSlice";

export default function NavigationBar() {
  const user = useSelector(selectUser);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={Logo} alt="Raiment" height={40} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/products">
              Products
            </Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/upload">
                  Upload
                </Nav.Link>
                <Nav.Link as={Link} to="/user-dashboard">
                  Dashboard
                </Nav.Link>
              </>
            ) : (
              <></>
            )}
            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search for an item"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
