import React, { useState, useEffect } from "react";
import "firebase/compat/storage";
import { storage } from "../../firebase";
import { useDispatch } from "react-redux";
import { setImageURL } from "../../store/imageSlice";

export default function Upload() {
  let dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageArray, setImageArray] = useState([]);
  const [imageURLArray, setImageURLArray] = useState([]);

  // see the updated value of imageArray immediately after modifying it
  // useEffect(() => {
  //   console.log("image array", imageArray);
  //   localStorage.setItem("imageURLArray", JSON.stringify(imageURLArray));
  // }, [imageArray]);

  const handleImageSelect = (e) => {
    setSelectedImage(e.target.files[0]);
    dispatch(
      setImageURL({
        imageURL: URL.createObjectURL(e.target.files[0]),
      })
    );
    setImageArray((prevImageArray) => [...prevImageArray, e.target.files[0]]);
    setImageURLArray((prevImageArray) => [
      ...prevImageArray,
      URL.createObjectURL(e.target.files[0]),
    ]);
    console.log("selected image", e.target.files[0]);
    console.log("image url", URL.createObjectURL(e.target.files[0]));
  };

  const handleImageUpload = () => {
    if (selectedImage) {
      const storageRef = storage.ref();
      const imageRef = storageRef.child(selectedImage.name);
      const uploadTask = imageRef.put(selectedImage);

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
  };

  return (
    <div>
      <input type="file" onChange={handleImageSelect} />
      <button onClick={handleImageUpload}>Upload</button>
      {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
    </div>
  );
}