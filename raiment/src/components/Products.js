import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import { ref, onValue } from "firebase/database";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store/userSlice";
import { useParams } from "react-router-dom";

export default function Products() {
  let { userInput } = useParams();

  console.log("userInput", userInput);

  let navigate = useNavigate();

  const user = useSelector(selectUser);

  const [posts, setPosts] = useState({});
  const [keys, setKeys] = useState([]);
  const [imagesLinkedToPosts, setImagesLinkedToPosts] = useState({});

  useEffect(() => {
    console.log("posts useState", posts);
    console.log("keys useState", keys);
    console.log("imagesLinkedToPosts useState", imagesLinkedToPosts);
  }, [posts, keys, imagesLinkedToPosts]);

  const db = firebase.database();
  
  useEffect(() => {
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
            obj.title.toLowerCase().includes(userInput.toLowerCase()) ||
            obj.description.toLowerCase().includes(userInput.toLowerCase())
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
  }, [userInput]);

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

      <h3>Showing results for {userInput.toLowerCase()}</h3>

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
                            <Card.Text>
                              ${posts[key].price} | Size:{" "}
                              {posts[key].size.toUpperCase()} |{" "}
                              {posts[key].zipcode}
                            </Card.Text>
                            <Card.Text>@{posts[key].username}</Card.Text>
                            {user && user.username ? (
                              posts[key].username !== user.username ? (
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
                              )
                            ) : (
                              <Button variant="primary">Login to chat</Button>
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
