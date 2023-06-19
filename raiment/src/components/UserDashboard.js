import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../store/userSlice";
import { storage } from "../firebase";
import { ref, get, off, remove } from "firebase/database";
// import { db } from "../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function UserDashboard() {
  const user = useSelector(selectUser);
  const [posts, setPosts] = useState({}); // used to be empty array
  const [keys, setKeys] = useState([]);
  const [imagesLinkedToPosts, setImagesLinkedToPosts] = useState({}); // used to be empty array

  useEffect(() => {
    console.log("imagesLinkedToPosts", imagesLinkedToPosts);
    console.log("posts", posts);
  }, [imagesLinkedToPosts, posts]);

  useEffect(() => {
    const db = firebase.database();
    const dataRef = ref(db, `listings/${user.username}/`);

    // Attach a listener for the "value" event to get the data
    // onValue(
    //   dataRef,
    //   (snapshot) => {
    //     const data = snapshot.val();
    //     console.log("data", data);
    //     console.log("data.images", data.images);
    //     setPost(data);
    //     const names = data.images.map((image) => image.name);
    //     for (let i = 0; i < names.length; i++) {
    //       console.log("names[i]", names[i]);
    //       getImageUrl(names[i]);
    //     }
    //   },
    //   (error) => {
    //     console.log("Error fetching data:", error);
    //   }
    // );

    get(dataRef)
      .then((snapshot) => {
        const data = snapshot.val();
        var count = Object.keys(data).length;
        var keys = Object.keys(data);
        setKeys(Object.keys(data));

        console.log("count", count);
        console.log("keys", keys);
        console.log("data", data);

        // iterate over all keys in listings/user/
        // each key contains a value of JSON object with an item listing data
        for (let i = 0; i < keys.length; i++) {
          const obj = data[keys[i]];
          console.log("current obj", obj);
          setPosts((prevPosts) => {
            return { ...prevPosts, [keys[i]]: obj };
          });
          console.log("posts", posts);
          const names = obj.images.map((image) => image.name);
          console.log("names", names);
          // for (let i = 0; i < names.length; i++) {
          //   console.log("names[i]", names[i]);
          //   // maybe i call getImageUrl() with names variable and iterate through names in the function itself ???
          //   getImageUrl(names[i], i);
          // }
          getImageUrl(names, keys[i]);
        }
        console.log("imagesLinkedToPosts", imagesLinkedToPosts);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });

    // accepts an additional index parameter. Index is used to update the correct position in the imageURLs state array, ensuring that the URLs are stored in the correct order.
    // ensures that each URL is stored in the corresponding position in the imageURLs state array. As a result, the images are rendered only once, and in the correct order.
    // const getImageUrl = async (name, index, postKey) => {
    //   try {
    //     const imageRef = storage.ref().child(name);
    //     const url = await imageRef.getDownloadURL();
    //     console.log("getting image url for", name);
    //     setImageURLs((prevArray) => {
    //       const updatedArray = [...prevArray];
    //       updatedArray[index] = url;
    //       return updatedArray;
    //     });
    //   } catch (error) {
    //     console.log("Error getting image URL:", error);
    //   }
    // };

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

    // Clean up the listener to avoid registering it multiple times
    return () => {
      off(dataRef);
    };
  }, []);

  function handleDelete(key) {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      const db = firebase.database();
      const dataRef = ref(db, `listings/${user.username}/${key}`);
      remove(dataRef)
        .then(() => {
          console.log("Item removed successfully.");
        })
        .catch((error) => {
          console.error("Error removing item:", error);
        });
      window.location.reload();
    }
  }

  return (
    <div>
      <h1>{`Hi ${user.username}!`}</h1>
      <h3>My posts</h3>
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
                            <Button>Edit</Button>{" "}
                            <Button onClick={() => handleDelete(key)}>
                              Delete
                            </Button>
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
