import React, { useState, useRef, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { storage } from "../../firebase";

export default function CreateListing() {
  // const [item, setItem] = useState({ title: "", description: "", images: [] });
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageArray, setImageArray] = useState([]);
  const [imageURLArray, setImageURLArray] = useState([]);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  useEffect(() => {
    console.log("image url array", imageURLArray);
    console.log("image array", imageArray);
    // localStorage.setItem("imageURLArray", JSON.stringify(imageURLArray));
  }, [imageURLArray, imageArray]);

  // submit listing
  const handleSubmit = () => {};

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
    } else {
      setImageURLArray((prevImageArray) => [
        ...prevImageArray,
        URL.createObjectURL(e.target.files[0]),
      ]);
      setImageArray((prevImageArray) => [...prevImageArray, e.target.files[0]]);
    }
  };
  // original
  //   const handleImageSelect2 = (e) => {
  //     setImage2(e.target.files[0]);
  //     setImageURLArray((prevImageArray) => [
  //       ...prevImageArray,
  //       URL.createObjectURL(e.target.files[0]),
  //     ]);
  //   };
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
    e.preventDefault(); //prevents page from refreshing and removing images
    console.log("inside handleImageUpload", imageArray);
    if (imageArray.length > 0) {
      for (let i = 0; i < imageArray.length; i++) {
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
          <Form.Control type="text" ref={titleRef} style={{ width: "200px" }} />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formItemDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            ref={descriptionRef}
            style={{ width: "200px" }}
          />
        </Form.Group>

        <Container>
          <Row>
            <Col>
              <Card style={{ width: "15rem" }}>
                {image1 != null ? (
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
              {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
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
              {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
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
              {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
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
              {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
            </Col>
          </Row>
        </Container>
        <br />
        <button onClick={handleImageUpload}>Upload Images</button>
        {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
        <br />
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}
