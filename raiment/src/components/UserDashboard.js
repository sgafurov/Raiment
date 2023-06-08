import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../store/userSlice";
import { storage } from "../firebase";
import { ref, onValue, get, off } from "firebase/database";
import { db } from "../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";

export default function UserDashboard() {
  const user = useSelector(selectUser);
  const [imageURLs, setImageURLs] = useState([]);
  // const [posts, setPosts] = useState([]);
  const [post, setPost] = useState({});

  useEffect(() => {
    const db = firebase.database();
    const dataRef = ref(db, "listings/jason");

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
        console.log("data", data);
        console.log("data.images", data.images);
        setPost(data);
        // setPosts((prevPosts) => [...prevPosts, data]);
        const names = data.images.map((image) => image.name);
        for (let i = 0; i < names.length; i++) {
          console.log("names[i]", names[i]);
          getImageUrl(names[i], i);
        }
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });

    // accepts an additional index parameter. Index is used to update the correct position in the imageURLs state array, ensuring that the URLs are stored in the correct order.
    // ensures that each URL is stored in the corresponding position in the imageURLs state array. As a result, the images are rendered only once, and in the correct order.
    const getImageUrl = async (name, index) => {
      try {
        const imageRef = storage.ref().child(name);
        const url = await imageRef.getDownloadURL();
        console.log("getting image url for", name);
        setImageURLs((prevArray) => {
          const updatedArray = [...prevArray];
          updatedArray[index] = url;
          return updatedArray;
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

  return (
    <div>
      <h1>{`Hi ${user.username}!`}</h1>
      <h3>My posts</h3>
      
      {post && (
        <Card style={{ width: "18rem" }}>
          <Carousel>
            {imageURLs.map((url, index) => {
              return (
                <Carousel.Item key={index}>
                  <img className="d-block w-100" src={url} alt="" />
                </Carousel.Item>
              );
            })}
          </Carousel>
          <Card.Body>
            <Card.Title>{post.title}</Card.Title>
            <Card.Text>{post.description}</Card.Text>
            <Card.Text>${post.price}</Card.Text>
            <Card.Text>Size {post.size}</Card.Text>
          </Card.Body>
        </Card>
      )}

      {/* {posts &&
        posts.map((post, index) => {
          return (
            <>
            <h1>posts length = {posts.length}</h1>
              <Card style={{ width: "18rem" }}>
                <Carousel>
                  {imageURLs.map((url, index) => {
                    return (
                      <Carousel.Item key={index}>
                        <img className="d-block w-100" src={url} alt="" />
                      </Carousel.Item>
                    );
                  })}
                </Carousel>
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>{post.description}</Card.Text>
                  <Card.Text>${post.price}</Card.Text>
                  <Card.Text>Size {post.size}</Card.Text>
                </Card.Body>
              </Card>
            </>
          );
        })} */}
      {/* {imageURLs.length > 0 &&
        imageURLs.map((url, index) => (
          <img src={url} alt="" style={{ width: "200px", height: "auto" }} />
        ))} */}
    </div>
  );
}
