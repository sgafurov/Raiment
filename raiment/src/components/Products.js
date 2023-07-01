import React, { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import { ref, startAt, onValue, equalTo } from "firebase/database";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store/userSlice";

export default function Products() {
  let navigate = useNavigate();
  const inputRef = useRef(null);
  const user = useSelector(selectUser);
  const [posts, setPosts] = useState({});
  const [keys, setKeys] = useState([]);
  const [imagesLinkedToPosts, setImagesLinkedToPosts] = useState({});
  const [triggerUseEffect, setTriggerUseEffect] = useState(true);

  useEffect(() => {
    console.log("posts useState", posts);
    console.log("keys useState", keys);
    console.log("imagesLinkedToPosts useState", imagesLinkedToPosts);
  }, [posts, keys, imagesLinkedToPosts]);

  useEffect(() => {
    if (triggerUseEffect) {
      const db = firebase.database();
      var usernames = [];

      const listingsRef = ref(db, "listings/"); // get all of the keys in the database under "listings/"" (usernames are the keys)
      onValue(listingsRef, (snapshot) => {
        const data = snapshot.val();
        console.log("listings data", data);
        usernames = Object.keys(data); // top level of keys are the usernames
        console.log("keys/usernames", usernames);

        var postKeysArray = [];
        for (let i = 0; i < usernames.length; i++) {
          const postsRef = ref(db, "listings/" + usernames[i] + "/"); // process all the listings for each user
          onValue(postsRef, (snapshot) => {
            const data = snapshot.val(); // object: { "key1": {post object}, "key2": {post object} }
            console.log(`${usernames[i]}'s posts`, data);
            var postKeys = Object.keys(data); // an array of keys for each post [ "key1", "key2" ]
            console.log("keys for the posts", postKeys);
            postKeys.forEach((value) => {
              postKeysArray.push(value);
            });

            for (let i = 0; i < postKeys.length; i++) {
              // access post the object linked to each key
              const obj = data[postKeys[i]];
              console.log("obj", obj);
              const names = obj.images.map((image) => image.name);
              console.log("obj images names", names);
              setPosts((prevPosts) => {
                return { ...prevPosts, [postKeys[i]]: obj };
              });
              getImageUrl(names, postKeys[i]);
            }
          });
        }
        setKeys(postKeysArray);
      });
    }
  }, [triggerUseEffect]);

  const handleChange = (e) => {
    e.preventDefault();
    const userInput = inputRef.current.value;
    if (userInput === "") {
      setTriggerUseEffect(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("inputRef", inputRef.current.value);
    const userInput = inputRef.current.value;
    if (userInput) {
      setTriggerUseEffect(false); // dont show useEffect. Show the filtered posts instead.

      const db = firebase.database();

      var usernames = [];
      const listingsRef = ref(db, "listings/"); // get all of the keys in the database under "listings/"" (usernames are the keys)
      onValue(listingsRef, (snapshot) => {
        const data = snapshot.val();
        console.log("listings data", data);
        usernames = Object.keys(data); // top level of keys are the usernames
        console.log("keys/usernames", usernames);
      });

      var postKeysArray = [];
      for (let i = 0; i < usernames.length; i++) {
        const postsRef = ref(db, "listings/" + usernames[i] + "/"); // process all the listings for each user
        onValue(postsRef, (snapshot) => {
          const data = snapshot.val(); // object: { "key1": {post object}, "key2": {post object} }
          console.log(`${usernames[i]}'s posts`, data);
          var postKeys = Object.keys(data); // an array of keys for each post [ "key1", "key2" ]
          console.log("keys for the posts", postKeys);

          for (let i = 0; i < postKeys.length; i++) {
            // access post the object linked to each key
            const obj = data[postKeys[i]];
            console.log("obj", obj);
            const names = obj.images.map((image) => image.name);
            console.log("obj images names", names);
            console.log(
              "obj.title.includes(userInput)",
              obj.title,
              obj.title.includes(userInput)
            );
            // if the post's title or description contains the userinput
            if (
              obj.title.includes(userInput) ||
              obj.description.includes(userInput)
            ) {
              setPosts((prevPosts) => {
                return { ...prevPosts, [postKeys[i]]: obj };
              });
              getImageUrl(names, postKeys[i]);
              postKeysArray.push(postKeys[i]);
            }
          }
        });
      }
      setKeys(postKeysArray);
    } else {
      alert("Enter a search value");
    }
  };

  const getImageUrl = async (names, postKey) => {
    try {
      for (let i = 0; i < names.length; i++) {
        const imageRef = storage.ref().child(names[i]);
        const url = await imageRef.getDownloadURL();
        console.log("getting image url for", names[i]);
        names[i] = url; // overwrite the names array with the image url instead of image name
      }
      console.log("urlArray", names);
      setImagesLinkedToPosts((prevArray) => {
        return { ...prevArray, [postKey]: names };
      });
    } catch (error) {
      console.log("Error getting image URL:", error);
    }
  };

  function messageSeller(seller, key) {
    navigate(`/messageAsBuyer/${seller}:${key}`);
  }

  function handleEdit(key) {
    navigate(`/edit-listing/${key}`);
  }

  return (
    <div>
      <Form
        className="d-flex align-items-center"
        style={{ maxWidth: "300px", margin: "20px auto" }}
      >
        <Form.Control
          type="search"
          placeholder="Search for an item"
          className="me-2"
          aria-label="Search"
          ref={inputRef}
          onChange={handleChange}
        />
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Search
        </Button>
      </Form>
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
      {triggerUseEffect ? (
        <h3>Showing all listings</h3>
      ) : (
        <h3>Showing results for {inputRef.current.value}</h3>
      )}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <Container>
          <Row>
            {keys &&
              keys.map((key, index) => {
                const carouselKey = `carousel-${key}`; // Unique key for each Carousel
                const cardKey = `card-${key}`; // Unique key for each Card
                return (
                  <Col className="d-flex justify-content-center">
                    <div key={index}>
                      <Card style={{ width: "18rem" }} key={cardKey}>
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
                        {posts[key] && (
                          <Card.Body key={cardKey}>
                            <Card.Title>{posts[key].title}</Card.Title>
                            <Card.Text>{posts[key].description}</Card.Text>
                            <Card.Text>${posts[key].price}</Card.Text>
                            <Card.Text>size {posts[key].size}</Card.Text>
                            <Card.Text>zip code {posts[key].zipcode}</Card.Text>
                            <Card.Text>user {posts[key].username}</Card.Text>
                            {posts[key].username !== user.username ? (
                              <Button
                                variant="primary"
                                onClick={() =>
                                  messageSeller(posts[key].username, key)
                                }
                              >
                                Message seller
                              </Button>
                            ) : (
                              <Button
                                variant="primary"
                                onClick={() => handleEdit(key)}
                              >
                                Edit listing
                              </Button>
                            )}
                          </Card.Body>
                        )}
                      </Card>
                    </div>
                  </Col>
                );
              })}
          </Row>
        </Container>
      </div>
    </div>
  );
}
