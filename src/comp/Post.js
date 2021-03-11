import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./Post.css";
import { db } from "../config/firebase";
import firebase from "firebase";

function Post({ user, postId, username, image, captions }) {
  //  states
  const [Comments, setComments] = useState([]);
  const [Comment, setComment] = useState("");

  // userEffects
  useEffect(() => {
    let CommentsData;
    if (postId) {
      CommentsData = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp' , 'desc')
        .onSnapshot((snapshot) =>
          setComments(snapshot.docs.map((doc) => doc.data()))
        );
    }

    return () => {
      CommentsData();
    };
  }, [postId]);

  // functios
  const handleAddComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      username: user.displayName,
      text: Comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setComment("");
  };

  return (
    <div className="post">
      {/* header -> avater + username */}
      <div className="post__header">
        <Avatar className="post__avater" src="/" alt={username}></Avatar>
        <h3>{username}</h3>
      </div>
      {/* image */}

      <img className="post__image" src={image} alt="Post name"></img>

      {/* username - captions  */}

      <h4 className="post__text">
        <strong>{username}</strong> {captions}
      </h4>

      {Comments.length > 0 && (
        <div className="post__comments">
          {Comments?.map((comment) => (
            <p className="post__commentsText">
              <strong>{comment.username}</strong> {comment.text}
            </p>
          ))}
        </div>
      )}
      {user && (
        <div className="post__commentAddBox">
          <form className="post__coomentForm">
            <input
              type="text"
              placeholder="add comment.."
              className="post__commentInput"
              value={Comment}
              onChange={(event) => setComment(event.target.value)}
            />

            <button
              disabled={!Comment}
              className="post__commentButtton"
              onClick={handleAddComment}
              type="submit"
            >
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Post;
