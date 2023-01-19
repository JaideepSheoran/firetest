import React, { useState } from 'react';
import './Comment.css';
import { database } from '../../Helper/Firebase';
import { getDoc, doc, getDocs, query, collection, where, setDoc, updateDoc } from 'firebase/firestore';

function Comment({ comment, commentList, postID , setpostCommentsList}) {

    const [commentForm, setcommentForm] = useState(false);
    const [newComment, setNewComment] = useState({
        parentID: '',
        by: '',
        content: ''
    });

    const setChange = (e) => {
        const value = e.target.value;
        const ID = comment.selfID;
        const USER = JSON.parse(window.sessionStorage.getItem('user')).username;
        setNewComment({ ...newComment, ['content']: value, ['parentID']: ID, ['by']: USER });
    }


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
            });
        } else {
            console.log("No such document!");
        }
    }

    return (
        <div className='comment-container'>
            <p>
               <span> @{comment.by} </span>
                {comment.content}
                <button onClick={(e) => {
                   e.preventDefault();
                   setcommentForm(true);
                }}>Reply</button>
            </p>
            <div className='comment-box'>
                {
                    commentForm &&
                    <div className="comment-form">
                        <input onChange={setChange} value={newComment.content} placeholder='Comment...' type='text' />
                        <div className="comment-btns">
                            <button onClick={(e) => {
                                e.preventDefault();
                                setcommentForm(false);
                            }}>Cancel</button>
                            <button onClick={(e) => {
                                e.preventDefault();
                                console.log(newComment);
                                const postRef = doc(database, "post", postID);
                                getDoc(postRef).then((snap) => {
                                    const DATA = snap.data();
                                    if (DATA.comments === '') {
                                        const newCommetsSection = doc(collection(database, 'comments'));
                                        console.log("NEW->", newCommetsSection);
                                        const newCommentRef = doc(collection(database, `${newCommetsSection.path}/comment`));
                                        setDoc(newCommentRef, newComment).then((res) => {
                                            console.log(res);
                                        }).catch(err => {
                                            console.log(err);
                                        });
                                        updateDoc(postRef, {
                                            comments: newCommetsSection.id
                                        }).then((res) => {
                                            alert('First Comment Added Sucessfully.');
                                            setcommentForm(false);
                                            loadComments();
                                        }).catch(err => { alert(err) });
                                    }
                                    else {
                                        const newCommentRef = doc(collection(database, `comments/${DATA.comments}/comment`));
                                        setDoc(newCommentRef, newComment).then((res) => {
                                            setcommentForm(false);
                                            loadComments();
                                        }).catch(err => {
                                            console.log(err);
                                        });
                                    }
                                })
                            }}>Add</button>
                        </div>
                    </div>
                }
                <div className="comment-replies">
                    {
                        commentList.map((cmnt) => {
                            return (
                                comment.selfID === cmnt.parentID
                                    ?
                                    <Comment postID={postID} key={cmnt.selfID} comment={cmnt} commentList={commentList} setpostCommentsList = {setpostCommentsList} />
                                    :
                                    <></>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Comment;