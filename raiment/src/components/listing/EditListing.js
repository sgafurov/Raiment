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
import uuid from "react-uuid";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { useParams } from "react-router-dom";

export default function EditListing() {
  let { key } = useParams();

  const user = useSelector(selectUser);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const priceRef = useRef(null);
  const sizeRef = useRef(null);
  const zipcodeRef = useRef(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageArray, setImageArray] = useState([]); // contains image File data
  const [imageURLArray, setImageURLArray] = useState([]); // contains the URL of the image
  const [imageJSONArray, setImageJSONArray] = useState([]); // contains image File data but as JSON

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [post, setPost] = useState();

  useEffect(() => {
    console.log("post", post);
    console.log("imageArray", imageArray);
    console.log("imageURLArray", imageURLArray);
    console.log("imageJSONArray", imageJSONArray);
  }, [post, imageArray, imageURLArray, imageJSONArray]);

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
    // setImage1(e.target.files[0]);
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
    // setImage2(e.target.files[0]);
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
    // setImage3(e.target.files[0]);
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
    // setImage4(e.target.files[0]);
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

  const handleImageUpload = (e) => {
    e.preventDefault(); // prevents page from refreshing and removing images
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
          }
        );
      }
    }
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
    if (
      !/^\d*\.?\d+$/.test(zipcodeRef.current.value) ||
      parseFloat(zipcodeRef.current.value) <= 0
    ) {
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

    const images = {
      0: imageJSONArray[0] ? imageJSONArray[0] : null,
      1: imageJSONArray[1] ? imageJSONArray[1] : null,
      2: imageJSONArray[2] ? imageJSONArray[2] : null,
      3: imageJSONArray[3] ? imageJSONArray[3] : null,
    };
    const updatedData = {
      username: user.username,
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      price: priceRef.current.value,
      size: sizeRef.current.value,
      zipcode: zipcodeRef.current.value,
      images: images,
      createdAt: new Date(),
    };

    update(dataRef, updatedData)
      .then(() => {
        console.log("Data updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  }

  // update listing in the database
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !titleRef.current.value ||
      !descriptionRef.current.value ||
      !priceRef.current.value ||
      !sizeRef.current.value ||
      !zipcodeRef.current.value
    ) {
      return;
    }
    updateListingData();
  };

  return (
    <div>
      <h1>Edit listing</h1>
      <Form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Form.Group className="mb-3" controlId="formItemTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            ref={titleRef}
            value={post && post.title ? post.title : ""}
            onChange={(event) => handleChange(event, "title")}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formItemDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            ref={descriptionRef}
            value={post && post.description ? post.description : ""}
            onChange={(event) => handleChange(event, "description")}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formItemPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="text"
            ref={priceRef}
            value={post && post.price ? post.price : ""}
            onChange={(event) => handleChange(event, "price")}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formItemSize">
          <Form.Label>Size</Form.Label>
          <Form.Control
            type="text"
            ref={sizeRef}
            value={post && post.size ? post.size : ""}
            onChange={(event) => handleChange(event, "size")}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formItemZipCode">
          <Form.Label>Zip Code</Form.Label>
          <Form.Control
            type="text"
            ref={zipcodeRef}
            value={post && post.zipcode ? post.zipcode : ""}
            onChange={(event) => handleChange(event, "zipcode")}
          />
        </Form.Group>

        <Container>
          <Row>
            <Col>
              <Card style={{ width: "15rem" }}>
                {imageURLArray[0] !== null ? (
                  <Card.Img variant="top" src={imageURLArray[0]} />
                ) : (
                  <Card.Text>No image available</Card.Text>
                )}
                <Card.Body>
                  <div>
                    <input type="file" onChange={handleImageSelect1} />
                  </div>
                </Card.Body>
              </Card>
              {imageURLArray[0] !== null && uploadProgress > 0 && (
                <p>Upload Progress: {uploadProgress}%</p>
              )}
            </Col>

            <Col>
              <Card style={{ width: "15rem" }}>
                {imageURLArray[1] !== null ? (
                  <Card.Img variant="top" src={imageURLArray[1]} />
                ) : (
                  <Card.Text>No image available</Card.Text>
                )}
                <Card.Body>
                  <div>
                    <input type="file" onChange={handleImageSelect2} />
                  </div>
                </Card.Body>
              </Card>
              {imageURLArray[1] !== null && uploadProgress > 0 && (
                <p>Upload Progress: {uploadProgress}%</p>
              )}
            </Col>

            <Col>
              <Card style={{ width: "15rem" }}>
                {imageURLArray[2] !== null ? (
                  <Card.Img variant="top" src={imageURLArray[2]} />
                ) : (
                  <Card.Text>No image available</Card.Text>
                )}
                <Card.Body>
                  <div>
                    <input type="file" onChange={handleImageSelect3} />
                  </div>
                </Card.Body>
              </Card>
              {imageURLArray[2] !== null && uploadProgress > 0 && (
                <p>Upload Progress: {uploadProgress}%</p>
              )}
            </Col>

            <Col>
              <Card style={{ width: "15rem" }}>
                {imageURLArray[3] !== null ? (
                  <Card.Img variant="top" src={imageURLArray[3]} />
                ) : (
                  <Card.Text>No image available</Card.Text>
                )}
                <Card.Body>
                  <div>
                    <input type="file" onChange={handleImageSelect4} />
                  </div>
                </Card.Body>
              </Card>
              {imageURLArray[3] !== null && uploadProgress > 0 && (
                <p>Upload Progress: {uploadProgress}%</p>
              )}
            </Col>
          </Row>
        </Container>
        <br />
        <Button
          style={{ background: "grey", border: "none" }}
          onClick={handleImageUpload}
        >
          Upload Images
        </Button>
        {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
        <br />
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Edit listing
        </Button>
      </Form>
    </div>
  );
}
