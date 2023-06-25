import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { query, collection, onSnapshot, where } from "firebase/firestore";
import { dbFirestone } from "../../firebase";
import Message from "./Message";
import SendMessage from "./SendMessage";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/userSlice";
import { useParams } from "react-router-dom";
import { ref, get, off } from "firebase/database";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { storage } from "../../firebase";
import Carousel from "react-bootstrap/Carousel";
import uuid from "react-uuid";

export default function Inbox() {
  const [messageThreads, setMessageThreads] = useState([]);
  const user = useSelector(selectUser);

  useEffect(() => {
    const userInboxRef = collection(
      dbFirestone,
      `messages/${user.username}/inbox/` // gets every single message in this user's inbox
    );

    const singleMessagesQuery = query(userInboxRef);

    const unsubscribe = onSnapshot(singleMessagesQuery, (QuerySnapshot) => {
      const fetchedMessages = [];
      console.log("QuerySnapshot", QuerySnapshot);
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });

      const uniquePostKeys = [];
      const filteredMessages = fetchedMessages.filter((message) => { // get unique message threads
        if (!uniquePostKeys.includes(message.postKey)) {
          uniquePostKeys.push(message.postKey);
          return true;
        }
        return false;
      });

      const sortedMessages = filteredMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessageThreads(sortedMessages);
      console.log("fetchedMessages", fetchedMessages);
      console.log("filteredMessages", filteredMessages);
    });
    return () => unsubscribe;
  }, []);

  return (
    <div>
      <Col>
        <Row>
          <div className="messages-wrapper">
            {messageThreads?.map((message) => (
              <p>See convo for listing {message.postKey}</p>
            ))}
          </div>
        </Row>
      </Col>
    </div>
  );
}
