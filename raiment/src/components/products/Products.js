import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { ref, get, off } from "firebase/database";
import { storage } from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";

import { selectUser } from "../../store/userSlice";
import FilterButtons from "./FilterButtons";
import "../../styles/products.css";

export default function Products() {
  const user = useSelector(selectUser);

  let { userInput, category } = useParams();

  let navigate = useNavigate();
  let location = useLocation();

  // Check the pathname to determine which parameter to use
  const isSearchPath = location.pathname.startsWith("/products/search");
  const isCategoryPath = location.pathname.startsWith("/products/category");

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
  const listingsRef = ref(db, "listings/"); // get all of the keys in the database under "listings/"" (usernames are the keys)

  useEffect(() => {
    get(listingsRef)
      .then((snapshot) => {
        const data = snapshot.val();
        const usernames = Object.keys(data); // top level of keys are the usernames
        fetchPosts(usernames);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    return () => {
      off(listingsRef);
    };
  }, [
    userInput,
    selectedCategory,
    selectedBrand,
    selectedCondition,
    selectedSize,
    category,
  ]);

  //  fetches posts for each user in db
  const fetchPosts = async (usernames) => {
    const postKeysArray = [];
    for (let i = 0; i < usernames.length; i++) {
      const postsRef = ref(db, "listings/" + usernames[i] + "/"); // process all the listings for each user
      const snapshot = await get(postsRef);
      const data = snapshot.val(); // user's listings: { "key1": {post object}, "key2": {post object} }
      processPosts(data, postKeysArray);
    }
    setKeys(postKeysArray);
  };

  // process each post by getting info, images, and storing posts in array
  const processPosts = (data, postKeysArray) => {
    const postKeys = Object.keys(data); // an array of keys for each post [ "key1", "key2" ]
    for (let i = 0; i < postKeys.length; i++) {
      const obj = data[postKeys[i]]; // access post object linked to each key
      const names = obj.images.map((image) => image.name);

      if (shouldInclude(obj)) {
        setPosts((prevPosts) => {
          return { ...prevPosts, [postKeys[i]]: obj };
        });
        getImageUrl(names, postKeys[i]);
        postKeysArray.push(postKeys[i]);
      }
    }
  };

  // checks if post should be included based on if the user searched for it, or selected category
  const shouldInclude = (obj) => {
    // Filtering logic based on selected filters
    const matchesCategory =
      selectedCategory === "Category" || obj.category === selectedCategory;
    const matchesBrand =
      selectedBrand === "Brand" || obj.brand === selectedBrand;
    const matchesCondition =
      selectedCondition === "Condition" || obj.condition === selectedCondition;
    const matchesSize = selectedSize === "Size" || obj.size === selectedSize;

    if (isSearchPath) {
      // Check if the post's title or description contains the userInput
      const matchesUserInput = obj.description
        .toLowerCase()
        .includes(userInput.toLowerCase());
      // only finds and includes posts based on user inpht and filters
      return (
        matchesUserInput &&
        matchesCategory &&
        matchesBrand &&
        matchesCondition &&
        matchesSize
      );
    } else if (isCategoryPath) {
      // only finds and includes posts based on matching category and filters
      return (
        obj.category == category &&
        matchesCategory &&
        matchesBrand &&
        matchesCondition &&
        matchesSize
      );
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

  const resetFilters = () => {
    setSelectedCategory("Category");
    setSelectedBrand("Brand");
    setSelectedCondition("Condition");
    setSelectedSize("Size");
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
      <h3 className="results-title">
        {isSearchPath && `Showing results for ${userInput.toLowerCase()}`}
        {isCategoryPath && `Showing results for ${category}`}
      </h3>

      <div className="filters-outer-wrapper">
        <FilterButtons
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedCondition={selectedCondition}
          setSelectedCondition={setSelectedCondition}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
        />
        <Button variant="secondary" onClick={resetFilters}>
          Reset Filters
        </Button>
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
                      <Card.Text>
                        {posts[key].brand} • ${posts[key].price} • Location
                        {posts[key].zipcode}
                      </Card.Text>

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
