import "./App.css";
import Logo from "./assets/logo.png";
import Post from "./comp/Post";
import React, { useState, useEffect } from "react";
import { db, auth } from "./config/firebase";
import AddNewPost from "./comp/post/AddNewPost";
import {
  Input,
  Modal,
  makeStyles,
  Button,
  FormControl,
} from "@material-ui/core";

function getModalStyle() {
  return {
    top: "50%",
    left: "50%",
    transform: "translate(-50% , -50%)",
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  //  states
  const [posts, setposts] = useState([]);
  const [modal, setmodal] = useState(false);
  const [signInModal, setsignInModal] = useState(false);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [username, setusername] = useState("");
  const [user, setuser] = useState(null);
  //  useEffects
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setposts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //  user logged in
        setuser(authUser);

        if (!authUser.displayName) {
          //  update display name for user
          return authUser.updateProfile({
            displayName: username,
          });
        }
        //  else do not update user name
      } else {
        //  user looged out
        setuser(null);
      }
    });

    return () => {
      //  perform some clean up
      unsubscribe();
    };
  }, [user, username]);

  //  funcitionss
  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setmodal(false);
  };

  const login = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setsignInModal(false);
  };

  return (
    <div className="App">
      <div className="app__header">
        {/* header section */}
        <div>
          <img className="app__headerImage" alt="instagram" src={Logo}></img>
        </div>

        {user ? (
          <Button color="primary" type="button" onClick={() => auth.signOut()}>
            Logout
          </Button>
        ) : (
          <div className="login__container">
            <Button
              color="primary"
              type="button"
              onClick={() => setsignInModal(true)}
            >
              Login
            </Button>
            <Button
              color="primary"
              type="button"
              onClick={() => setmodal(true)}
            >
              Sign Up
            </Button>
          </div>
        )}
        {user?.displayName && (
          <AddNewPost username={user.displayName}></AddNewPost>
        )}
        {/*  sign up modal */}
        <Modal open={modal} onClose={() => setmodal(false)}>
          <div style={modalStyle} className={classes.paper}>
            <div>
              <form className="mymodal__signUpForm">
                <center>
                  <img
                    className="app__headerImage"
                    alt="instagram"
                    src={Logo}
                  ></img>
                </center>

                <FormControl className="mymodal__formControll">
                  <Input
                    placeholder="Username"
                    onChange={(event) => setusername(event.target.value)}
                    type="text"
                  />
                </FormControl>

                <FormControl className="mymodal__formControll">
                  <Input
                    placeholder="Email"
                    onChange={(event) => setemail(event.target.value)}
                    type="email"
                  />
                </FormControl>

                <FormControl className="mymodal__formControll">
                  <Input
                    placeholder="Password"
                    onChange={(event) => setpassword(event.target.value)}
                    type="password"
                  />
                </FormControl>

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={signUp}
                >
                  Sign Up
                </Button>
              </form>
            </div>
          </div>
        </Modal>

        {/* login modal */}
        <Modal open={signInModal} onClose={() => setsignInModal(false)}>
          <div style={modalStyle} className={classes.paper}>
            <div>
              <form className="mymodal__signUpForm">
                <center>
                  <img
                    className="app__headerImage"
                    alt="instagram"
                    src={Logo}
                  ></img>
                </center>

                <FormControl className="mymodal__formControll">
                  <Input
                    placeholder="Email"
                    onChange={(event) => setemail(event.target.value)}
                    type="email"
                  />
                </FormControl>

                <FormControl className="mymodal__formControll">
                  <Input
                    placeholder="Password"
                    onChange={(event) => setpassword(event.target.value)}
                    type="password"
                  />
                </FormControl>

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={login}
                >
                  Sign Up
                </Button>
              </form>
            </div>
          </div>
        </Modal>
      </div>
      {/* posts */}

      <div className="app_posts">
        {posts.map(({ id, post }) => (
          <Post
            key={id}
            user={user}
            postId={id}
            username={post.username}
            image={post.image}
            captions={post.caption}
          ></Post>
        ))}
      </div>
    </div>
  );
}

export default App;
