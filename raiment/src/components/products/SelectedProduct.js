import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import Dropdown from "react-bootstrap/Dropdown";
import { ref, onValue } from "firebase/database";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/userSlice";
import { useParams } from "react-router-dom";

export default function SelectedProduct() {
  const { params } = useParams();
  const parts = params.split(":");
  const sellerName = parts[0];
  const postKey = parts[1];

  let navigate = useNavigate();
  const user = useSelector(selectUser);

  const [post, setPost] = useState({});
  const [imagesLinkedToPosts, setImagesLinkedToPosts] = useState({});

  useEffect(() => {
    console.log("post useState", post);
    console.log("imagesLinkedToPosts useState", imagesLinkedToPosts);
  }, [post, imagesLinkedToPosts]);

  const db = firebase.database();

  useEffect(() => {
    const listingRef = ref(db, `listings/${sellerName}/${postKey}`); //
    onValue(listingRef, (snapshot) => {
      const data = snapshot.val();
      console.log("listing data", data);
      setPost(data);
      const imageNames = data.images.map((image) => image.name);
      getImageUrl(imageNames, postKey);
    });
  }, []);

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
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {imagesLinkedToPosts[postKey] && (
          <Carousel key={`carousel-${postKey}`} interval={null}>
            {imagesLinkedToPosts[postKey].map((url, index) => {
              const imageKey = `image-${index}`;
              return (
                <Carousel.Item key={imageKey}style={{width:"500px"}}>
                  <img className="d-block w-100" src={url} alt="" style={{width:"50px"}}/>
                </Carousel.Item>
              );
            })}
          </Carousel>
        )}

        <Card.Body key={`card-${postKey}`}>
          <p className="info-header">
            Size {post.size} • {post.category} • {post.condition}
          </p>
          <Card.Text>{post.description}</Card.Text>
          <Card.Text>{post.brand}</Card.Text>
          <Card.Text>${post.price}</Card.Text>
          <Card.Text>Zipcode {post.zipcode}</Card.Text>

          {user && user.username ? (
            post.username !== user.username ? (
              <Button
                variant="primary"
                onClick={() => messageSeller(post.username, postKey)}
              >
                Message @{post.username}
              </Button>
            ) : (
              <Button variant="primary" onClick={() => handleEdit(postKey)}>
                Edit my listing
              </Button>
            )
          ) : (
            <Button
              onClick={() => {
                navigate("/login");
              }}
              variant="primary"
            >
              Login to chat
            </Button>
          )}
        </Card.Body>
      </div>
    </div>
  );
}
