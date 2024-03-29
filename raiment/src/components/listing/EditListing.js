import React, { useEffect, useState, useRef } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { storage } from "../../firebase";
import { ref, get, off, update } from "firebase/database";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/userSlice";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { useParams } from "react-router-dom";
import "../../styles/createListing.css"
import Dropdown from "react-bootstrap/Dropdown";

export default function EditListing() {
  let { key } = useParams();

  const user = useSelector(selectUser);

  const descriptionRef = useRef(null);
  const priceRef = useRef(null);
  const zipcodeRef = useRef(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageArray, setImageArray] = useState([]); // contains image File data
  const [imageURLArray, setImageURLArray] = useState([]); // contains the URL of the image

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [post, setPost] = useState();
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedBrand, setSelectedBrand] = React.useState("");
  const [selectedCondition, setSelectedCondition] = React.useState("");
  const [selectedSize, setSelectedSize] = React.useState("");

  useEffect(() => {
    console.log("post", post);
    console.log("imageArray", imageArray);
    console.log("imageURLArray", imageURLArray);
    if (post && post.category) {
      setSelectedCategory(post.category);
    }
    if (post && post.brand) {
      setSelectedBrand(post.brand);
    }
    if (post && post.condition) {
      setSelectedCondition(post.condition);
    }
    if (post && post.size) {
      setSelectedSize(post.size);
    }
  }, [post, imageArray, imageURLArray]);

  useEffect(() => {
    const db = firebase.database();
    const dataRef = ref(db, `listings/${user.username}/${key}`);

    get(dataRef)
      .then((snapshot) => {
        const data = snapshot.val();
        console.log("post data", data);
        setPost(data);
        const names = data.images.map((image) => image.name);
        console.log("names", names);
        getImageUrl(names);
        console.log("data.images", data.images);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });

    const getImageUrl = async (names) => {
      try {
        for (let i = 0; i < names.length; i++) {
          const imageRef = storage.ref().child(names[i]);
          const url = await imageRef.getDownloadURL();
          console.log("getting image url for", names[i]);
          names[i] = url;
        }
        console.log("names urlArray", names);
        // setImagesLinkedToPost((prevArray) => {
        //   return { ...prevArray, [key]: names };
        // });
        setImageURLArray(names);
      } catch (error) {
        console.log("Error getting image URL:", error);
      }
    };

    // Clean up the listener to avoid registering it multiple times
    return () => {
      off(dataRef);
    };
  }, []);

  const handleImageSelect1 = (e) => {
    setImage1(e.target.files[0]);
    setImageArray((prevImageArray) => {
      const updatedArray = [...prevImageArray];
      updatedArray[0] = e.target.files[0];
      return updatedArray;
    });
    setImageURLArray((prevImageArray) => {
      const updatedArray = [...prevImageArray];
      updatedArray[0] = URL.createObjectURL(e.target.files[0]);
      return updatedArray;
    });
  };

  const handleImageSelect2 = (e) => {
    setImage2(e.target.files[0]);
    setImageArray((prevImageArray) => {
      const updatedArray = [...prevImageArray];
      updatedArray[1] = e.target.files[0];
      return updatedArray;
    });
    setImageURLArray((prevImageArray) => {
      const updatedArray = [...prevImageArray];
      updatedArray[1] = URL.createObjectURL(e.target.files[0]);
      return updatedArray;
    });
  };

  const handleImageSelect3 = (e) => {
    setImage3(e.target.files[0]);
    setImageArray((prevImageArray) => {
      const updatedArray = [...prevImageArray];
      updatedArray[2] = e.target.files[0];
      return updatedArray;
    });
    setImageURLArray((prevImageArray) => {
      const updatedArray = [...prevImageArray];
      updatedArray[2] = URL.createObjectURL(e.target.files[0]);
      return updatedArray;
    });
  };

  const handleImageSelect4 = (e) => {
    setImage4(e.target.files[0]);
    setImageArray((prevImageArray) => {
      const updatedArray = [...prevImageArray];
      updatedArray[3] = e.target.files[0];
      return updatedArray;
    });
    setImageURLArray((prevImageArray) => {
      const updatedArray = [...prevImageArray];
      updatedArray[3] = URL.createObjectURL(e.target.files[0]);
      return updatedArray;
    });
  };

  const handlePriceInput = () => {
    if (
      !/^\d*\.?\d+$/.test(priceRef.current.value) ||
      parseFloat(priceRef.current.value) <= 0
    ) {
      priceRef.current.value = priceRef.current.value.replace(/[^0-9.]/g, "");
      return;
    }
  };

  const handleZipcodeInput = () => {
    if (zipcodeRef.current.value.length > 5) {
      alert("Zipcode can only contain 5 digits")
      zipcodeRef.current.value = "";
    }
    if (
      !/^\d*\.?\d+$/.test(zipcodeRef.current.value)) {
      zipcodeRef.current.value = zipcodeRef.current.value.replace(
        /[^0-9]/g,
        ""
      );
      return;
    }
  };

  const handleChange = (event, attribute) => {
    if (attribute === "price") {
      handlePriceInput();
    }
    if (attribute === "zipcode") {
      handleZipcodeInput();
    }
    const { value } = event.target;
    setPost((prevPost) => ({ ...prevPost, [attribute]: value }));
  };

  function updateListingData() {
    const db = firebase.database();
    const dataRef = ref(db, `listings/${user.username}/${key}`);

    // const images = {
    //   0: imageJSONArray[0] ? imageJSONArray[0] : null,
    //   1: imageJSONArray[1] ? imageJSONArray[1] : null,
    //   2: imageJSONArray[2] ? imageJSONArray[2] : null,
    //   3: imageJSONArray[3] ? imageJSONArray[3] : null,
    // };

    // let images = {};

    let images = { ...post.images }; // NEW Copy existing images

    // will go as json in firebase database
    if (image1) {
      let imgObj = {
        name: image1.name,
        lastModified: image1.lastModified,
        size: image1.size,
        type: image1.type,
      };
      // images = {
      //   ...post.images, // preserve the existing images
      //   0: imgObj, // update the 1st child with the new value
      // };

      images[0] = imgObj; // NEW

      // will upload as actual file in firebase storage
      setImageArray((prevImageArray) => {
        const updatedArray = [...prevImageArray];
        updatedArray[0] = image1;
        return updatedArray;
      });
    }
    if (image2) {
      let imgObj = {
        name: image2.name,
        lastModified: image2.lastModified,
        size: image2.size,
        type: image2.type,
      };
      // images = {
      //   ...post.images,
      //   1: imgObj,
      // };

      images[1] = imgObj; // NEW

      setImageArray((prevImageArray) => {
        const updatedArray = [...prevImageArray];
        updatedArray[1] = image2;
        return updatedArray;
      });
    }
    if (image3) {
      let imgObj = {
        name: image3.name,
        lastModified: image3.lastModified,
        size: image3.size,
        type: image3.type,
      };
      // images = {
      //   ...post.images,
      //   2: imgObj,
      // };

      images[2] = imgObj; // NEW

      setImageArray((prevImageArray) => {
        const updatedArray = [...prevImageArray];
        updatedArray[2] = image3;
        return updatedArray;
      });
    }
    if (image4) {
      let imgObj = {
        name: image4.name,
        lastModified: image4.lastModified,
        size: image4.size,
        type: image4.type,
      };
      // images = {
      //   ...post.images,
      //   3: imgObj,
      // };

      images[3] = imgObj; // NEW

      setImageArray((prevImageArray) => {
        const updatedArray = [...prevImageArray];
        updatedArray[3] = image4;
        return updatedArray;
      });
    }
    console.log("images when updating listing", images);

    // uploads only the newly selected images to storage
    for (let i = 0; i < imageArray.length; i++) {
      const storageRef = storage.ref();
      if (imageArray[i]) {
        const imageRef = storageRef.child(imageArray[i].name);
        const uploadTask = imageRef.put(imageArray[i]);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress(progress);
          },
          (error) => {
            console.log(error);
          },
          () => {
            console.log("Upload complete");
          }
        );
      }
    }

    const updatedData = {
      description: descriptionRef.current.value,
      category: selectedCategory,
      brand: selectedBrand,
      condition: selectedCondition,
      size: selectedSize,
      price: priceRef.current.value,
      zipcode: zipcodeRef.current.value,
      images: images,
      updatedAt: new Date().toISOString(),
    };

    update(dataRef, updatedData)
      .then(() => {
        console.log("Data updated successfully.");
        alert("Done!")
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  }

  // update listing in the database
  const handleSubmit = (e) => {
    e.preventDefault();
    // if (
    //   !titleRef.current.value ||
    //   !descriptionRef.current.value ||
    //   !priceRef.current.value ||
    //   !sizeRef.current.value ||
    //   !zipcodeRef.current.value
    // ) {
    //   return;
    // }

    // if (
    //   !descriptionRef.current.value ||
    //   !selectedCategory ||
    //   !selectedBrand ||
    //   !selectedCondition ||
    //   !selectedSize ||
    //   !priceRef.current.value ||
    //   !zipcodeRef.current.value
    // ) {
    //   return;
    // }
    updateListingData();
  };

  return (
    <div>
      <Form
        className="formDiv"
      >

        <h1 className="title">Edit listing</h1>

        <div className="description">
          <label htmlFor="description" className="label">
            <h2 className="labelText">Description</h2>
          </label>
          <textarea type="text" ref={descriptionRef} value={post && post.description ? post.description : ""} className="descText" onChange={(event) => handleChange(event, "description")}>
          </textarea>
        </div>

        <div className="infoDropdowns">
          <div className="info">
            <label htmlFor="category" className="label">
              <h2 className="labelText">Category</h2>
            </label>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">{selectedCategory}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSelectedCategory("Menswear")}>Menswear</Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedCategory("Womenswear")}>Womenswear</Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedCategory("Jewelry")}>Jewelry</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="info">
            <label htmlFor="brand" className="label">
              <h2 className="labelText">Brand</h2>
            </label>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">{selectedBrand}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSelectedBrand("Acne")}>Acne</Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedBrand("Adidas")}>Adidas</Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedBrand("Nike")}>Nike</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="info">
            <label htmlFor="condition" className="label">
              <h2 className="labelText">Condition</h2>
            </label>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">{selectedCondition}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSelectedCondition("Brand new")}>Brand new</Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedCondition("Like new")}>Like new</Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedCondition("Used - Excellent")}>Used - Excellent</Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedCondition("Used - Good")}>Used - Good</Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedCondition("Used - Fair")}>Used - Fair</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="info">
            <label htmlFor="size" className="label">
              <h2 className="labelText">Size</h2>
            </label>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">{selectedSize}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSelectedSize("XS")}>XS</Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedSize("S")}>S</Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedSize("M")}>M</Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedSize("L")}>L</Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedSize("XL")}>XL</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <div className="price">
          <div>
            <label htmlFor="price" className="label">
              <h2 className="labelText">Price</h2>
            </label>
          </div>
          <div className="priceInput">
            $
            <input
              type="text"
              min="0"
              ref={priceRef}
              defaultValue={post && post.price ? post.price : ""}
              onChange={handlePriceInput}
              placeholder="Enter price in US $"
            />
          </div>
        </div>

        <div className="zipcode">
          <div>
            <label htmlFor="zipcode" className="label">
              <h2 className="labelText">Zipcode</h2>
            </label>
          </div>
          <div>
            <input
              type="text"
              ref={zipcodeRef}
              onChange={handleZipcodeInput}
              defaultValue={post && post.zipcode ? post.zipcode : ""}
              placeholder="Enter your zipcode"
            />
          </div>
        </div>

        <label htmlFor="photos" className="photosLabel">
          <h2 className="labelText">Photos</h2>
        </label>

        {/* contains all input boxes */}
        <div className="imageInputGroup">

          {/* contains an image */}
          <div className="imageInputWrapper">
            <label className="imageInputLabel">
              <div>
                <p type="caption1" className="caption">Add a photo</p>
              </div>
              <img className="selectedImage" src={imageURLArray[0]} />
              <input type="file" className="imageInput" onChange={handleImageSelect1} />
            </label>
          </div>

          {/* contains an image */}
          <div className="imageInputWrapper">
            <label className="imageInputLabel">
              <div>
                <p type="caption1" className="caption">Add a photo</p>
              </div>
              <img className="selectedImage" src={imageURLArray[1]} />
              <input type="file" className="imageInput" onChange={handleImageSelect2} />
            </label>
          </div>

          {/* contains an image */}
          <div className="imageInputWrapper">
            <label className="imageInputLabel">
              <div>
                <p type="caption1" className="caption">Add a photo</p>
              </div>
              <img className="selectedImage" src={imageURLArray[2]} />
              <input type="file" className="imageInput" onChange={handleImageSelect3} />
            </label>
          </div>

          {/* contains an image */}
          <div className="imageInputWrapper">
            <label className="imageInputLabel">
              <div>
                <p type="caption1" className="caption">Add a photo</p>
              </div>
              <img className="selectedImage" src={imageURLArray[3]} />
              <input type="file" className="imageInput" onChange={handleImageSelect4} />
            </label>
          </div>
        </div>

        <br />

        {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
        <br />
        <div className="upload-and-create-button">
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Edit listing
          </Button>
        </div>
      </Form>
    </div>
  );
}
