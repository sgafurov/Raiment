import React, { useState } from "react";
import "firebase/compat/storage";
import { storage } from "../../firebase";

// const Upload = () => {
export default function Upload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageSelect = (e) => {
    setSelectedImage(e.target.files[0]);
    console.log("selected image", e.target.files);
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

// export default Upload;
