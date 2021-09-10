import React from 'react'
import { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
// import InstagramEmbed from 'react-instagram-embed';

// material ui styleing
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
// material UI styleing
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  // modal way of writing code
    const classes = useStyles();  
    const [modalStyle] = React.useState(getModalStyle);
    // different states used in the code
    const [posts, setPosts] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [user, setUser] = React.useState(null);

    // authentication code. userEffect is also a listiner(frontend listiner in this case)
    useEffect(() => {
      // also a listiner (backend listiner in this case)
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if(authUser) {
          //user has logged in....
          console.log(authUser);
          setUser(authUser);
        } else {
          // user has logged ....
          setUser(null);
        }
      })

      return() => {
        //perform some cleanup actions before you refile the useEffect 
        unsubscribe(null)
      }
    }, [user, username]);


    //useEffect runs a pice of code based on a specific condition
    useEffect(() => {
      // this is where the code runs
      db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        //every time a new post is added, this code fires...
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id, post: doc.data()
        })));
      })
    }, []);

    // sign up code
    const signUp = (event) => {
      event.preventDefault();

      // creates user
      auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      //ckecks any error in action
      .catch((error) => alert(error.message))
      
      // prevent modal for being open
      setOpen(false);
    }

    const signIn = (event) => {
      event.preventDefault();

      auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

      // prevent modal for being open
      setOpenSignIn(false)
    }

  return (
    <div className="App">
     
      {/* creating model, like a pop up so people can put username */}
      <Modal
       open={open}
       onClose={() => setOpen(false)} >
      {/* closes the model when you click outside the model*/}
      <div style={modalStyle} className={classes.paper}>
        {/* form used in sign up */}
        <form className="app__signup">
          <center>
            <img className="app__headerImage" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgdeuM0dnAIIYQAR0xzAO66R26eN2xMqvHkA&usqp=CAU" alt=""/>
          </center>

          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
        </form>
    </div>
      </Modal>

      {/* sign in modal */}
      <Modal
       open={openSignIn}
       onClose={() => setOpenSignIn(false)} >
      {/* closes the model when you click outside the model*/}
      <div style={modalStyle} className={classes.paper}>
        {/* form used in sign in */}
        <form className="app__signup">
          <center>
            <img className="app__headerImage" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgdeuM0dnAIIYQAR0xzAO66R26eN2xMqvHkA&usqp=CAU" alt=""/>
          </center>

            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" onClick={signIn}>Sign In</Button>
        </form>
    </div>
      </Modal>
      
      <div className="app__header">
        <img
        className="app__headerImage" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgdeuM0dnAIIYQAR0xzAO66R26eN2xMqvHkA&usqp=CAU"
         alt=""/>

        {/* capital B material UI button and CLT + SpaceBar authomatically import */}
      {user ? (
        //sign out button
      <Button onClick={()=> auth.signOut()}>Logout</Button>
      ): (
        //sign in button
        <div className="ap__loginContainer">
          <Button onClick={()=> setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={()=> setOpen(true)}>Sign Up</Button>
        </div>
        
      )}
    </div>
      
      <div className="app__posts">
        <div className="app__postLeft">
          {/* posting code prototype */}
        {
          posts.map(({id, post}) => (
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
        }
        </div>
        <div className="app_postRight">
          {/* <InstagramEmbed
          // clientAccessToken='<appId>|<clientToken>'
          // url='https://instagr.am/p/Zw9o4/'
          // maxWidth={375}   
          // hideCaption={false}
          // containerTagName='div'
          // protocol=''
          // injectScript
          // onLoading={() => {}}
          // onSuccess={() => {}}
          // onAfterRender={() => {}}
          // onFailure={() => {}}
        /> */}
      </div>
          
      </div>
      
      
       {/* this allow it to render only when the user is signed in. */}
       {user?.displayName ? (
        //if the displayName is present do this 
        <ImageUpload username={user.displayName} />
      ) : (  
        // if the username is not there then
        <h3>Sorry you need to Login to Upload</h3>
      )}

    </div>
  );
}

export default App;
