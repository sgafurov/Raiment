import React, { useState, useRef, useEffect } from "react";
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

export default function CreateListing() {
  const user = useSelector(selectUser);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const priceRef = useRef(null);
  const sizeRef = useRef(null);
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

  useEffect(() => {
    console.log("image url array", imageURLArray);
    console.log("image array", imageArray);
    // localStorage.setItem("imageURLArray", JSON.stringify(imageURLArray));
  }, [imageURLArray, imageArray]);

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
    title,
    description,
    price,
    size,
    zipcode,
    imageJSONArray
  ) {
    console.log("user.username", user.username);
    console.log(
      "contents of the listing",
      title,
      description,
      price,
      size,
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
    set(ref(db, "listings/" + user.username + "/" + randomID), {
      listingId: randomID,
      username: user.username,
      title: title,
      description: description,
      price: price,
      size: size,
      zipcode: zipcode,
      images: images,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // submit listing
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
    writeListingData(
      titleRef.current.value,
      descriptionRef.current.value,
      priceRef.current.value,
      sizeRef.current.value,
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

  return (
    <div>
      <h1>List an item</h1>
      <Form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Form.Group className="mb-3" controlId="formItemTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" ref={titleRef} />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formItemDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" ref={descriptionRef} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formItemPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="text"
            ref={priceRef}
            onChange={handlePriceInput}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formItemSize">
          <Form.Label>Size</Form.Label>
          <Form.Control type="text" ref={sizeRef} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formItemZipCode">
          <Form.Label>Zip Code</Form.Label>
          <Form.Control
            type="text"
            ref={zipcodeRef}
            onChange={handleZipcodeInput}
          />
        </Form.Group>

        <Container>
          <Row>
            <Col>
              <Card style={{ width: "15rem" }}>
                {image1 !== null ? (
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
              {image1 !== null && uploadProgress > 0 && (
                <p>Upload Progress: {uploadProgress}%</p>
              )}
            </Col>

            <Col>
              <Card style={{ width: "15rem" }}>
                {image2 !== null ? (
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
              {image2 !== null && uploadProgress > 0 && (
                <p>Upload Progress: {uploadProgress}%</p>
              )}
            </Col>

            <Col>
              <Card style={{ width: "15rem" }}>
                {image3 !== null ? (
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
              {image3 !== null && uploadProgress > 0 && (
                <p>Upload Progress: {uploadProgress}%</p>
              )}
            </Col>

            <Col>
              <Card style={{ width: "15rem" }}>
                {image4 !== null ? (
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
              {image4 !== null && uploadProgress > 0 && (
                <p>Upload Progress: {uploadProgress}%</p>
              )}
            </Col>
          </Row>
        </Container>
        <br />
        {!clickedUpload ? (
          <>
            <Button
              style={{ background: "grey", border: "none" }}
              onClick={handleImageUpload}
            >
              Upload Images
            </Button>
            {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
          </>
        ) : (
          <></>
        )}
        <br />
        {clickedUpload ? (
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Create listing
          </Button>
        ) : (
          <></>
        )}
      </Form>
    </div>
  );
}
