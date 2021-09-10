import React, { useEffect, useState } from 'react';
import './Post.css';
import { db } from './firebase';
import Avatar from '@material-ui/core/Avatar';
import firebase from 'firebase';

 function Post({ postId, user, username, caption, imageUrl }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    // on loading comments
    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                // access post collection
              .collection("posts")
              //go to the post document
              .doc(postId)
              //go inside the comment collection
              .collection("comments")
              .orderBy('timestamp', 'desc')
              //get a snapshot lister for that 
              .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
              });
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    //submit your comment to the database to the specific post
    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className="post">
            <div className="post__header">
            <Avatar className="post__avatar" alt="Rapoo" src="/static/images/avatar/1.jpg" />
            <h3>{username}</h3>
            </div>

            <img className="post__image" src={imageUrl} alt=""/>

            <h4 className="post__text"><strong>{username}</strong> {caption} </h4>

             {/*map through the each comment and pop out the p tag */}
            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>

            {user && (
                //comment input
                <form className="post__commentBox">
                    <input 
                    className="post__input" 
                    type="text"
                    placeholder="Add a Comment..." 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} />

                    <button 
                    disabled={!comment} 
                    className="post__button" 
                    type="submit" 
                    onClick={postComment} >
                        Post
                    </button>
                </form> 
            )}

            
        </div>
    )
}

export default Post