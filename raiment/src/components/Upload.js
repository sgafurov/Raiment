import React, { useState } from "react";
import { BASE_URL } from "../constants";

// export default function Upload() {
//   const [selectedImage, setSelectedImage] = useState("");

//   return (
//     <div>
//       <h1>Upload and Display Image</h1>
//       {selectedImage && (
//         <div>
//           <img
//             alt="not found"
//             width={"250px"}
//             src={URL.createObjectURL(selectedImage)}
//           />
//           <br />
//           <button
//             onClick={() => {
//               setSelectedImage(null);
//               localStorage.removeItem("image");
//             }}
//           >
//             Remove
//           </button>
//         </div>
//       )}
//       <br />
//       <br />
//       <input
//         type="file"
//         name="myImage"
//         onChange={(event) => {
//           const file = event.target.files[0];
//           console.log("file type", typeof file, file);
//           setSelectedImage(file);
//           let url = URL.createObjectURL(file);
//           console.log("URL.createObjectURL(file)", url);
//           localStorage.setItem("image", JSON.stringify(file));
//           localStorage.setItem("url", url);
//         }}
//       />
//     </div>
//   );
// }

////////////////////////////////////////////////////////////////////////////////////////////
// export default function Upload() {
//   const [previewImage, setPreviewImage] = useState(null);
//   const [uploadedImage, setUploadedImage] = useState(null);

//   const handleUploadImage = () => {
//       const data = new FormData();
//       data.append('files[]', previewImage);
//   }

//   const handleSelectImage = (event) => {
//       const file = event.target.files[0];
//       const fileReader = new FileReader();
//       fileReader.addEventListener("load", () => {
//           setPreviewImage(fileReader.result);
//       });
//       fileReader.readAsDataURL(file);
//   }

//   return (
//       <div>
//           <input type="file" onChange={handleSelectImage} />
//           {
//               previewImage ?
//                   <img src={previewImage} alt="preview-image" />
//               :
//                   null
//           }
//           {
//               uploadedImage ?
//                   <img src={uploadedImage} alt="uploaded-image" />
//               :
//                   null
//           }
//           <button onClick={handleUploadImage}>Upload</button>
//       </div>
//   );
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// export default function Upload() {
//   const [selectedImage, setSelectedImage] = useState(null);

//   // On file select (from the pop up)
//   const onFileChange = (event) => {
//     // Update the state
//     setSelectedImage(event.target.files[0])
//   };

//   // On file upload (click the upload button)
//   const onFileUpload = () => {
//     // Create an object of formData
//     const formData = new FormData();

//     // Update the formData object
//     formData.append(
//       "myFile",
//       selectedImage,
//       selectedImage.name
//     );

//     // Details of the uploaded file
//     console.log(selectedImage);

//     // Request made to the backend api
//     // Send formData object
//   };

//   // File content to be displayed after
//   // file upload is complete
//   const fileData = () => {
//     if (selectedImage) {
//       return (
//         <div>
//           <h2>File Details:</h2>
//           <p>File Name: {selectedImage.name}</p>

//           <p>File Type: {selectedImage.type}</p>

//         </div>
//       );
//     } else {
//       return (
//         <div>
//           <br />
//           <h4>Choose before Pressing the Upload button</h4>
//         </div>
//       );
//     }
//   };

//   return (
//     <div>
//       <h1>GeeksforGeeks</h1>
//       <h3>File Upload using React!</h3>
//       <div>
//         <input type="file" onChange={onFileChange} />
//         <button onClick={onFileUpload}>Upload!</button>
//       </div>
//       {fileData()}
//     </div>
//   );
// }

export default function Upload() {
  async function postImage({ image }) {
    const formData = new FormData();
    formData.append("image", image);

    // const result = await axios.post("/images", formData, {
    //   headers: { "Content-Type": "multipart/form-data" },
    // });
    // return result.data;

    try {
      const res = await fetch(`${BASE_URL}/product/post`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const resObject = await res.json(); // or res.data ??
      console.log("resObject from upload.js", resObject);

      if (resObject.status === 400) {
        throw resObject;
      }

      if (resObject.status === 403) {
        throw resObject;
      }

      alert("image uploaded");
    } catch (err) {
      console.log("error line 89 of review form", err);
      if (err.status === 400 || err.status === 403) {
        alert(err.message);
      }
    }
  }

  const [file, setFile] = useState();
  const [images, setImages] = useState([]);

  const submit = async (event) => {
    event.preventDefault();
    const result = await postImage({ image: file });
    setImages([result.image, ...images]);
  };

  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  return (
    <div className="App">
      <form onSubmit={submit}>
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <button type="submit">Submit</button>
      </form>

      {images.map((image) => (
        <div key={image}>
          <img src={image} alt=""></img>
        </div>
      ))}

      <img src="/images/9fa06d3c5da7aec7f932beb5b3e60f1d" alt=""></img>
    </div>
  );
}
