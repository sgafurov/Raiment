import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { query, collection, onSnapshot, where } from "firebase/firestore";
import { dbFirestone } from "../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import "firebase/compat/database";

export default function Inbox() {
  const [messageThreads, setMessageThreads] = useState([]);
  const user = useSelector(selectUser);
  let navigate = useNavigate();

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
      const filteredMessages = fetchedMessages.filter((message) => {
        // get unique message threads
        if (!uniquePostKeys.includes(message.postKey)) {
          uniquePostKeys.push(message.postKey);
          return true;
        }
        return false;
      });

      console.log("fetchedMessages", fetchedMessages);
      console.log("filteredMessages", filteredMessages);

      const sortedMessages = filteredMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessageThreads(sortedMessages);
    });
    return () => unsubscribe;
  }, []);

  //   function messageSeller(seller, key) {
  //     navigate(`/message/${seller}:${key}`);
  //   }
  function messageUser(message) {
    if (message.seller === user.username) {
        navigate(`/messageAsSeller/${message.buyer}:${message.seller}:${message.postKey}`);
    } else {
        navigate(`/messageAsBuyer/${message.seller}:${message.postKey}`);
    }
  }

  // if ur buyer, messageSeller
  // if ur seller, messageBuyer

  return (
    <div>
      <Row>
        <div className="messages-wrapper">
          {messageThreads.length > 0 ? (
            messageThreads.map((message) => (
              <Col>
                <Button
                  //   onClick={() => messageSeller(message.seller, message.postKey)}
                  onClick={() => messageUser(message)}
                  style={{ margin: "10px" }}
                >
                  See convo for listing: {message.postTitle}
                </Button>
              </Col>
            ))
          ) : (
            <h3>No messages</h3>
          )}
        </div>
      </Row>
    </div>
  );
}
