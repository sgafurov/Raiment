import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import ChatBox from "./ChatBox";

export default function Inbox() {
  const [children, setChildren] = useState(["Convo 1", "Convo 2", "Convo 3"]);
  // create a convo ID to keep track of messages in each message thread
  // all messages will include their convo id in the Message object
  return (
    <div>
      <Col>
        <Row>
          {children.map((child) => (
            <label>{child}</label>
          ))}
        </Row>
      </Col>
    </div>
  );
}
