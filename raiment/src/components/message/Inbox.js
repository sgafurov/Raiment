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
import firebase from "firebase/compat/app";
import { ref, get, off } from "firebase/database";
import { storage } from "../../firebase";
import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import "../../styles/inbox.css"

export default function Inbox() {
  const [messageThreads, setMessageThreads] = useState([]);
  const user = useSelector(selectUser);
  let navigate = useNavigate();

  const [posts, setPosts] = useState({});
  const [imageURLArray, setImageURLArray] = useState([]);
  const [imagesLinkedToPosts, setImagesLinkedToPosts] = useState({});

  useEffect(() => {
    console.log("messageThreads", messageThreads);
    console.log("posts", posts);
    console.log("imagesLinkedToPosts", imagesLinkedToPosts);
  }, [messageThreads, posts, imagesLinkedToPosts]);

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
      getPosts(sortedMessages);
    });
    return () => unsubscribe;
  }, []);

  function getPosts(messages) {
    for (let i = 0; i < messages.length; i++) {
      const seller = messages[i].seller;
      const postKey = messages[i].postKey;
      const db = firebase.database();
      const dataRef = ref(db, `listings/${seller}/${postKey}`);

      get(dataRef)
        .then((snapshot) => {
          const data = snapshot.val();
          console.log("data", data);
          setPosts((prevPosts) => {
            return { ...prevPosts, [postKey]: data };
          });
          const names = data.images.map((image) => image.name);
          console.log("names", names);
          getImageUrl(names, postKey);
        })
        .catch((error) => {
          console.log("Error fetching data:", error);
        });

      const getImageUrl = async (names, postKey) => {
        try {
          for (let i = 0; i < names.length; i++) {
            const imageRef = storage.ref().child(names[i]);
            const url = await imageRef.getDownloadURL();
            console.log("getting image url for", names[i]);
            names[i] = url;
          }
          console.log("names urlArray", names);
          setImagesLinkedToPosts((prevArray) => {
            return { ...prevArray, [postKey]: names };
          });
        } catch (error) {
          console.log("Error getting image URL:", error);
        }
      };
    }
  }

  function messageUser(message) {
    if (message.seller === user.username) {
      navigate(
        `/messageAsSeller/${message.buyer}:${message.seller}:${message.postKey}`
      );
    } else {
      navigate(`/messageAsBuyer/${message.seller}:${message.postKey}`);
    }
  }

  return (
    <div className="inbox">
      <h3>Messages</h3>
      <style>
        {`
          .column {
            margin: 0;
            padding: 0;
          }
        `}
      </style>
      <Container>
        <div className="messages-wrapper">
          {messageThreads.length > 0 ? (
            messageThreads.map((message, index) => {
              const key = message.postKey;
              const carouselKey = `carousel-${key}`;
              const cardKey = `card-${key}`;
              return (
                <Row>
                  <Col className="d-flex justify-content-center">
                    <Card style={{ width: "10rem" }} key={cardKey}>
                      {imagesLinkedToPosts[key] && (
                        <Carousel key={carouselKey} interval={null}>
                          {imagesLinkedToPosts[key].map((url, index) => {
                            const imageKey = `image-${index}-${key}`;
                            return (
                              <Carousel.Item key={imageKey}>
                                <img
                                  className="d-block w-100"
                                  src={url}
                                  alt=""
                                />
                              </Carousel.Item>
                            );
                          })}
                        </Carousel>
                      )}
                    </Card>
                    <Card style={{ width: "20rem" }} key={cardKey}>
                      {posts[key] && (
                        <Card.Body key={cardKey}>
                          <Card.Title>{posts[key].title}</Card.Title>
                          <Button
                            onClick={() => messageUser(message)}
                            style={{ margin: "10px" }}
                          >
                            Send message
                          </Button>
                        </Card.Body>
                      )}
                    </Card>
                  </Col>
                </Row>
              );
            })
          ) : (
            <h3>No messages</h3>
          )}
        </div>
      </Container>
    </div>
  );
}
