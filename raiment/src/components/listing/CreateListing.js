import Upload from "./Upload";
import React, { useState, useRef } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function CreateListing() {
  const [item, setItem] = useState({ title: "", description: "", images: [] });
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleSubmit = () => {};

  return (
    <div>
      <h1>List an item</h1>
      <Form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Form.Group className="mb-3" controlId="formItemTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" ref={titleRef} style={{ width: "200px" }} />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formItemDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            ref={descriptionRef}
            style={{ width: "200px" }}
          />
        </Form.Group>

        <Container>
          <Row>
            <Col>
              <Card style={{ width: "15rem" }}>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                  <Upload />
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card style={{ width: "15rem" }}>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                  <Upload />
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card style={{ width: "15rem" }}>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                  <Upload />
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card style={{ width: "15rem" }}>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                  <Upload />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        <br />
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}
