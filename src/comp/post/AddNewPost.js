import { Button, Input, LinearProgress } from "@material-ui/core";
import React, { useState } from "react";
import "./AddNewPost.css";
import { storage, db } from "../../config/firebase";
import firebase from "firebase";

function AddNewPost({ username }) {
  // states
  const [Caption, setCaption] = useState("");
  const [Image, setImage] = useState("");
  const [Progress, setProgress] = useState(0);

  //  functions
  const handleChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleUpload = (event) => {
    event.preventDefault();
    const uploadTask = storage.ref(`images/${Image.name}`).put(Image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //  if it give me errors
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(Image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: Caption,
              image: url,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
            // document.getElementById('addNewPost__imageInput').files = null
          });
      }
    );
  };

  return (
    <div className="addNewPost">
      <div className="addNewPost__container">
        <form className="addNewPost__form">
          <LinearProgress variant="determinate" value={Progress} />
          <Input
            placeholder="Enter a caption....."
            type="text"
            className="addPost__captionInput"
            value={Caption}
            onChange={(event) => setCaption(event.target.value)}
            id="addNewPost__imageInput"
          />
          <input type="file" onChange={handleChange} />

          <Button
            type="submit"
            color="primary"
            variant="contained"
            onClick={handleUpload}
          >
            Upload
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AddNewPost;
