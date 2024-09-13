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
import "../../styles/products.css";

export default function Products() {
  let { userInput } = useParams();

  console.log("userInput", userInput);

  let navigate = useNavigate();

  const user = useSelector(selectUser);

  const [posts, setPosts] = useState({});
  const [keys, setKeys] = useState([]);
  const [imagesLinkedToPosts, setImagesLinkedToPosts] = useState({});

  const [selectedCategory, setSelectedCategory] = React.useState("Category");
  const [selectedBrand, setSelectedBrand] = React.useState("Brand");
  const [selectedCondition, setSelectedCondition] = React.useState("Condition");
  const [selectedSize, setSelectedSize] = React.useState("Size");

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
            "obj.description.includes(userInput)",
            obj.description,
            obj.description.includes(userInput)
          );
          // if the post's title or description contains the userinput
          if (obj.description.toLowerCase().includes(userInput.toLowerCase())) {
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

  function navigateProductPage(sellerName, postKey) {
    console.log("seller name ", sellerName);
    console.log("postKey  ", postKey);
    navigate(`/product/${sellerName}:${postKey}`);
  }

  return (
    <div>
      <h3 className="resultsTitle">
        Showing results for "{userInput.toLowerCase()}"
      </h3>

      <div className="filtersOuterWrapper">
        <nav className="filtersDropdownContainer">
          <div className="filterContainer">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {selectedCategory}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setSelectedCategory("Category");
                  }}
                >
                  --Category--
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setSelectedCategory("Menswear");
                  }}
                >
                  Menswear
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setSelectedCategory("Womenswear");
                  }}
                >
                  Womenswear
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setSelectedCategory("Jewelry");
                  }}
                >
                  Jewelry
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="filterContainer">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {selectedBrand}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSelectedBrand("Brand")}>
                  --Brand--
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedBrand("Acne")}>
                  Acne
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedBrand("Adidas")}>
                  Adidas
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedBrand("Nike")}>
                  Nike
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="filterContainer">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {selectedCondition}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => setSelectedCondition("Condition")}
                >
                  --Condition--
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSelectedCondition("Brand new")}
                >
                  Brand new
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedCondition("Like new")}>
                  Like new
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSelectedCondition("Used - Excellent")}
                >
                  Used - Excellent
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSelectedCondition("Used - Good")}
                >
                  Used - Good
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setSelectedCondition("Used - Fair")}
                >
                  Used - Fair
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="filterContainer">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {selectedSize}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSelectedSize("Size")}>
                  --Size--
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedSize("XS")}>
                  XS
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedSize("S")}>
                  S
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedSize("M")}>
                  M
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedSize("L")}>
                  L
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedSize("XL")}>
                  XL
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </nav>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <ul className="items-grid">
          {keys &&
            keys.map((key, index) => {
              const carouselKey = `carousel-${key}`; // Unique key for each Carousel
              const cardKey = `card-${key}`; // Unique key for each Card
              return (
                <li key={index} className="item">
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
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                navigateProductPage(posts[key].username, key);
                              }}
                            />
                          </Carousel.Item>
                        );
                      })}
                    </Carousel>
                  )}
                  {posts[key] && (
                    <Card.Body key={cardKey}>
                      <p className="info-header">
                        Size {posts[key].size} • {posts[key].category} •{" "}
                        {posts[key].condition}
                      </p>
                      <Card.Text>{posts[key].description}</Card.Text>
                      <Card.Text>{posts[key].brand}</Card.Text>
                      <Card.Text>${posts[key].price}</Card.Text>
                      <Card.Text>Zipcode {posts[key].zipcode}</Card.Text>

                      {/* <Card.Text style={{ fontWeight: 'bold' }}>${posts[key].price}</Card.Text>
                      <Card.Text>{posts[key].size.toUpperCase()}</Card.Text>
                      <Card.Text>{posts[key].brand}</Card.Text> */}
                      {user && user.username ? (
                        posts[key].username !== user.username ? (
                          <Button
                            variant="primary"
                            onClick={() =>
                              messageSeller(posts[key].username, key)
                            }
                          >
                            Message @{posts[key].username}
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            onClick={() => handleEdit(key)}
                          >
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
                  )}
                </li>
              );
            })}
        </ul>
      </div>
      {keys.length === 0 && (
        <div className="alert alert-warning" role="alert">
          No products found for this category.
        </div>
      )}
    </div>
  );
}
