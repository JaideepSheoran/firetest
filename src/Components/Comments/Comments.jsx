import './Comments.css';
import React, { useState } from 'react';
import Comment from './Comment';
import { storage, database } from '../../Helper/Firebase';
import { doc, collection, updateDoc, arrayUnion, query, where, getDocs, getDoc } from 'firebase/firestore';

function Comments({ postID }) {

    const [fetched, setFetched] = useState(false);
    const [postCommentsList, setpostCommentsList] = useState([]);

    const loadComments = async () => {
        console.log(postID);
        const docRef = doc(database, "post", postID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const postCommentsID =  docSnap.data().comments;
            if(!postCommentsID) {
                alert('No Comments...');
                return;
            }
            const getAllCommentsQuery = query(collection(database, `comments/${postCommentsID}/comment`));
            getDocs(getAllCommentsQuery).then((commentsDocs) => {
                var list = [];
                commentsDocs.forEach((commentDoc) => {
                    var commentData = commentDoc.data();
                    commentData['selfID'] = commentDoc.id;
                    list.push(commentData);
                });
                setpostCommentsList(list);
                console.log(postCommentsList);
                setFetched(true);
            });
        } else {
            console.log("No such document!");
        }
    }

    return (
        <div className="comments-section">
            <button onClick={(e) => {
                e.preventDefault();
                loadComments();
            }}>Load Comments</button>
            <div className="comments-all">
                {
                    
                    postCommentsList && postCommentsList.map((comment) => {
                        return (
                            comment.parentID === ''
                            ?
                            <Comment key={comment.selfID} postID = {postID} comment={comment} commentList = {postCommentsList} setpostCommentsList = {setpostCommentsList} />
                            :
                            <> </>
                        )
                    })
                }
            </div>
            
        </div>
    );
}

export default Comments;