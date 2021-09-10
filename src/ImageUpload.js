import React, { useState } from 'react';
import firebase from "firebase";
import { db, storage } from './firebase';
import { Button } from '@material-ui/core';
import './ImageUpload.css';

function Imageupload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        //getting the first file you selected
        if (e.target.files[0]) {
            //set the image in state to it
            setImage(e.target.files[0]);
        }
    };

    //connecting to firebase to store upload
    const handleUpload = () => {
        // how we grap the image and store in firbase
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        //how to upload
        uploadTask.on(
            //showing the snapshot of the progress
            "state_changed",
            //time it will take 
            (snapshot) => {
                // progress function ....
                const progress = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            //any error while uploading
            (error) => {
                // Error function ....
                console.log(error);
                alert(error.message);
            },
            //when completed what happens
            () => {
                // complete function ...
                storage
                   // go to the refferd images
                  .ref("images")
                  // go to the image name child
                  .child(image.name)
                  //get the download URL(link). to grap the image and use it anywhere
                  .getDownloadURL()
                  //after getting everthing, do some stuff with it
                  .then(url => {
                      //post image inside db
                      db.collection("posts").add({
                          //timestamp help sort the post by there correct timing like bring the current post to the top
                          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                          caption: caption,
                          // the img url gotten already. img download link given from firebase
                          imageUrl: url,
                          username: username
                      });

                      setProgress(0);
                      setCaption("");
                      setImage(null);

                  })
            }
        )
    }

    return (
        <div className="imageupload">
            {/* i want to have the following */}
            {/* caption input */}
            {/* File Picker */}
            {/* Post button */}
            
            <progress className="imageupload__progress" value={progress} max="100" />
            <input type="text" placeholder="Enter a caption..." onChange={event => setCaption(event.target.value)} value={caption} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload} >
                Upload
            </Button>
        </div>
    )
}

export default Imageupload;