import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Dropdown from "react-bootstrap/Dropdown";

export default function Products() {
  return (
    <div>
      <h3>Showing results for "vintage" near 11215</h3>
      <Container>
        <Row>
          <Col>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Size
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">XXS</Dropdown.Item>
                <Dropdown.Item href="#/action-2">XS</Dropdown.Item>
                <Dropdown.Item href="#/action-3">S</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Brand
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Acne</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Adidas</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Airforce</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col>
            <Card style={{ width: "18rem" }}>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Vintage Tee</Card.Title>
                <Card.Text>$17 from MikesCloset</Card.Text>
                <Card.Text>Size L</Card.Text>
                <Card.Text>Vintage tee in good condition</Card.Text>
                <Button variant="primary">Add to cart</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card style={{ width: "18rem" }}>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Levi Jeans</Card.Title>
                <Card.Text>$25 from AmyLee</Card.Text>
                <Card.Text>Size 33</Card.Text>
                <Card.Text>Women's vintage Levi jeans</Card.Text>
                <Button variant="primary">Add to cart</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card style={{ width: "18rem" }}>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Vintage jacket</Card.Title>
                <Card.Text>$40 from tony444</Card.Text>
                <Card.Text>Size M</Card.Text>
                <Card.Text>Used jacket in good condition</Card.Text>
                <Button variant="primary">Add to cart</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
