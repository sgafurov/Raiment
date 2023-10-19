import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { storage } from "../../firebase";
import { getDatabase, ref, set } from "firebase/database";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/userSlice";
import uuid from "react-uuid";
import "../../styles/createListing.css";

import Dropdown from "react-bootstrap/Dropdown";

export default function CreateListing() {
  let navigate = useNavigate();

  const user = useSelector(selectUser);

  const descriptionRef = useRef(null);
  const categoryRef = useRef(null);
  const brandRef = useRef(null);
  const conditionRef = useRef(null);
  const sizeRef = useRef(null);
  const priceRef = useRef(null);
  const zipcodeRef = useRef(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageArray, setImageArray] = useState([]);
  const [imageURLArray, setImageURLArray] = useState([]);
  const [imageJSONArray, setImageJSONArray] = useState([]);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [clickedUpload, setClickedUpload] = useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState("Menswear");
  const [selectedBrand, setSelectedBrand] = React.useState("Acne");
  const [selectedCondition, setSelectedCondition] = React.useState("Brand new");
  const [selectedSize, setSelectedSize] = React.useState("XS");


  useEffect(() => {
    console.log("image url array", imageURLArray);
    console.log("image array", imageArray);
    console.log("descriptionRef", descriptionRef.current.value)
  }, [imageURLArray, imageArray, descriptionRef]);

  const handleImageSelect1 = (e) => {
    setImage1(e.target.files[0]);
    // overwrite image when new one is chosen
    if (imageURLArray[0]) {
      setImageURLArray((prevImageArray) => {
        const updatedArray = [...prevImageArray];
        updatedArray[0] = URL.createObjectURL(e.target.files[0]);
        return updatedArray;
      });
      setImageArray((prevImageArray) => {
        const updatedArray = [...prevImageArray];
        updatedArray[0] = e.target.files[0];
        return updatedArray;
      });
      setImageJSONArray((prevImageArray) => {
        const updatedArray = [...prevImageArray];
        updatedArray[0] = e.target.files[0];
        return updatedArray;
      });
    } else {
      setImageURLArray((prevImageArray) => [
        ...prevImageArray,
        URL.createObjectURL(e.target.files[0]),
      ]);
      setImageArray((prevImageArray) => [...prevImageArray, e.target.files[0]]);
    }
  };

  const handleImageSelect2 = (e) => {
    setImage2(e.target.files[0]);
    // overwrite image when new one is chosen
    if (imageURLArray[1]) {
      setImageURLArray((prevImageArray) => {
        const updatedArray = [...prevImageArray];
        updatedArray[1] = URL.createObjectURL(e.target.files[0]);
        return updatedArray;
      });
      setImageArray((prevImageArray) => {
        const updatedArray = [...prevImageArray];
        updatedArray[1] = e.target.files[0];
        return updatedArray;
      });
    } else {
      setImageURLArray((prevImageArray) => [
        ...prevImageArray,
        URL.createObjectURL(e.target.files[0]),
      ]);
      setImageArray((prevImageArray) => [...prevImageArray, e.target.files[0]]);
    }
  };

  const handleImageSelect3 = (e) => {
    setImage3(e.target.files[0]);
    // overwrite image when new one is chosen
    if (imageURLArray[2]) {
      setImageURLArray((prevImageArray) => {
        const updatedArray = [...prevImageArray];
        updatedArray[2] = URL.createObjectURL(e.target.files[0]);
        return updatedArray;
      });
      setImageArray((prevImageArray) => {
        const updatedArray = [...prevImageArray];
        updatedArray[2] = e.target.files[0];
        return updatedArray;
      });
    } else {
      setImageURLArray((prevImageArray) => [
        ...prevImageArray,
        URL.createObjectURL(e.target.files[0]),
      ]);
      setImageArray((prevImageArray) => [...prevImageArray, e.target.files[0]]);
    }
  };

  const handleImageSelect4 = (e) => {
    setImage4(e.target.files[0]);
    // overwrite image when new one is chosen
    if (imageURLArray[3]) {
      setImageURLArray((prevImageArray) => {
        const updatedArray = [...prevImageArray];
        updatedArray[3] = URL.createObjectURL(e.target.files[0]);
        return updatedArray;
      });
      setImageArray((prevImageArray) => {
        const updatedArray = [...prevImageArray];
        updatedArray[3] = e.target.files[0];
        return updatedArray;
      });
    } else {
      setImageURLArray((prevImageArray) => [
        ...prevImageArray,
        URL.createObjectURL(e.target.files[0]),
      ]);
      setImageArray((prevImageArray) => [...prevImageArray, e.target.files[0]]);
    }
  };

  const handleImageUpload = (e) => {
    // e.preventDefault(); // prevents page from refreshing and removing images
    console.log("inside handleImageUpload", imageArray);
    if (imageArray.length > 0) {
      for (let i = 0; i < imageArray.length; i++) {
        let newObject = {
          name: imageArray[i].name,
          lastModified: imageArray[i].lastModified,
          size: imageArray[i].size,
          type: imageArray[i].type,
        };
        setImageJSONArray((prev) => [...prev, newObject]);

        const storageRef = storage.ref();
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
            setClickedUpload(true);
          }
        );
      }
    }
  };

  function writeListingData(
    description,
    category,
    brand,
    condition,
    size,
    price,
    zipcode,
    imageJSONArray
  ) {
    console.log("user.username", user.username);
    console.log(
      "contents of the listing",
      description,
      category,
      brand,
      condition,
      size,
      price,
      zipcode,
      imageJSONArray
    );
    const db = getDatabase();
    const randomID = uuid();
    const images = {
      0: imageJSONArray[0] ? imageJSONArray[0] : null,
      1: imageJSONArray[1] ? imageJSONArray[1] : null,
      2: imageJSONArray[2] ? imageJSONArray[2] : null,
      3: imageJSONArray[3] ? imageJSONArray[3] : null,
    };
    const listingRef = ref(db, "listings/" + user.username + "/" + randomID);
    const listingData = {
      listingId: randomID,
      username: user.username,
      description: description,
      category: category,
      brand: brand,
      condition: condition,
      size: size,
      price: price,
      zipcode: zipcode,
      images: images,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set(listingRef, listingData)
      .then(() => {
        console.log("Listing data was successfully written.");
        navigate("/user-dashboard");
      })
      .catch((error) => {
        console.error("Error writing listing data:", error);
      });
  }

  // submit listing
  const handleSubmit = (e) => {
    e.preventDefault();
    // if (
    //   !descriptionRef.current.value ||
    //   !categoryRef.current.value ||
    //   !brandRef.current.value ||
    //   !conditionRef.current.value ||
    //   !sizeRef.current.value ||
    //   !priceRef.current.value ||
    //   !zipcodeRef.current.value
    // ) {
    //   return;
    // }
    writeListingData(
      descriptionRef.current.value,
      // categoryRef.current.value,
      selectedCategory,
      // brandRef.current.value,
      selectedBrand,
      // conditionRef.current.value,
      selectedCondition,
      // sizeRef.current.value,
      selectedSize,
      priceRef.current.value,
      zipcodeRef.current.value,
      imageJSONArray
    );
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

  return (
    <div>
      <Form className="formDiv">
        <h1 className="title">List an item</h1>

        <div className="description">
          <label htmlFor="description" className="label">
            <h2 className="labelText">Description</h2>
          </label>
          <textarea ref={descriptionRef} placeholder="eg. blue Levi's jeans, only worn a couple times" className="descText">
          </textarea>
        </div>

        <div className="infoDropdowns">
          <div className="info">
            <label htmlFor="category" className="label">
              <h2 className="labelText">Category</h2>
            </label>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic" ref={categoryRef}>{selectedCategory}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => {
                  setSelectedCategory("Menswear")
                  categoryRef.current = selectedCategory
                }}>Menswear</Dropdown.Item>
                <Dropdown.Item onClick={() => {
                  setSelectedCategory("Womenswear")
                  categoryRef.current = selectedCategory
                }}>Womenswear</Dropdown.Item>
                <Dropdown.Item onClick={() => {
                  setSelectedCategory("Jewelry")
                  categoryRef.current = selectedCategory
                }}>Jewelry</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="info">
            <label htmlFor="brand" className="label">
              <h2 className="labelText">Brand</h2>
            </label>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic" ref={brandRef}>{selectedBrand}</Dropdown.Toggle>
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
              <Dropdown.Toggle variant="success" id="dropdown-basic" ref={conditionRef}>{selectedCondition}</Dropdown.Toggle>
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
              <Dropdown.Toggle variant="success" id="dropdown-basic" ref={sizeRef}>{selectedSize}</Dropdown.Toggle>
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
            {/* <label htmlFor="moneyInput" style={{ fontWeight: 'bold'}}>US$</label> */}
            {/* <p className="sc-dmBhmd sc-cCIHMz eJYoNt dxkeZo">US$</p> */}
            <input
              type="text"
              min="0"
              ref={priceRef}
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
              placeholder="Enter your zipcode"
            />
          </div>
        </div>

        {/* <Container className="photos-container">
          <label htmlFor="photos" className="label">
            <h2 className="labelText">Photos</h2>
          </label>
          <Row>
            <Col>
              <Card style={{ width: "15rem" }}>
                {image1 !== null ? (
                  <Card.Img variant="top" src={imageURLArray[0]} />
                ) : (
                  <></>
                )
                }
                <Card.Body>
                  <div>
                    <input type="file" onChange={handleImageSelect1} />
                  </div>
                </Card.Body>
              </Card>
              {image1 !== null && uploadProgress > 0 && (
                <p>Upload Progress: {uploadProgress}%</p>
              )}
            </Col>

            <Col>
              <Card style={{ width: "15rem" }}>
                {image2 !== null ? (
                  <Card.Img variant="top" src={imageURLArray[1]} />
                ) : (
                  <></>
                )}
                <Card.Body>
                  <div>
                    <input type="file" onChange={handleImageSelect2} />
                  </div>
                </Card.Body>
              </Card>
              {image2 !== null && uploadProgress > 0 && (
                <p>Upload Progress: {uploadProgress}%</p>
              )}
            </Col>

            <Col>
              <Card style={{ width: "15rem" }}>
                {image3 !== null ? (
                  <Card.Img variant="top" src={imageURLArray[2]} />
                ) : (
                  <></>
                )}
                <Card.Body>
                  <div>
                    <input type="file" onChange={handleImageSelect3} />
                  </div>
                </Card.Body>
              </Card>
              {image3 !== null && uploadProgress > 0 && (
                <p>Upload Progress: {uploadProgress}%</p>
              )}
            </Col>

            <Col>
              <Card style={{ width: "15rem" }}>
                {image4 !== null ? (
                  <Card.Img variant="top" src={imageURLArray[3]} />
                ) : (
                  <></>
                )}
                <Card.Body>
                  <div>
                    <input type="file" onChange={handleImageSelect4} />
                  </div>
                </Card.Body>
              </Card>
              {image4 !== null && uploadProgress > 0 && (
                <p>Upload Progress: {uploadProgress}%</p>
              )}
            </Col>
          </Row>
        </Container> */}

        {/* NEW */}
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
        {!clickedUpload ? (
          <div className="upload-and-create-button">
            <Button
              style={{ background: "grey", border: "none" }}
              onClick={handleImageUpload}
            >
              Upload Images
            </Button>
            {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
          </div>
        ) : (
          <></>
        )}
        <br />
        {clickedUpload ? (
          <div className="upload-and-create-button">
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Create listing
            </Button>
          </div>
        ) : (
          <></>
        )}
      </Form>
    </div>
  );
}
