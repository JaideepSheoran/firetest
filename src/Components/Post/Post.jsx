import './Post.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Comments from '../Comments/Comments';
import { database } from '../../Helper/Firebase';
import { getDoc, doc, collection, setDoc, updateDoc } from 'firebase/firestore';


function Post({ post, setUsername, postID }) {
    const [likes, setlikes] = useState(post.likesCnt);
    const navigate = useNavigate();

    const [commentForm, setcommentForm] = useState(false);
    const [newComment, setNewComment] = useState({
        parentID: '',
        by: '',
        content: ''
    });

    const setChange = (e) => {
        const value = e.target.value;
        const USER = JSON.parse(window.sessionStorage.getItem('user')).username;
        setNewComment({ ...newComment, ['content']: value, ['parentID']: '', ['by']: USER });
    }

    return (
        <div className='post-container'>
            <img src={post.url} alt='Pic' className="post-img" />
            <div className="post-body">
                <div className="lsc">
                    <div className="lsc-nodes">
                        <i className="fa-regular fa-heart lcs-node"
                            onClick={(e) => {
                                e.preventDefault();
                                setlikes(likes + 1);
                            }}
                        ></i>
                        <i className="fa-regular fa-comment lcs-node" onClick={(e) => {
                            e.preventDefault();
                            setcommentForm(!commentForm);
                        }} ></i>
                        <i className="fa-solid fa-share-nodes lcs-node"></i>
                    </div>
                    <div className="savepost">
                        <i className="fa-regular fa-bookmark lcs-node"></i>
                    </div>
                </div>
                <div className="post-likes">{likes} likes</div>
                <div className="post-about">
                    <div className="post-title">
                        <span className='lnk'
                            onClick={(e) => {
                                e.preventDefault();
                                setUsername(post.user);
                                navigate(`/account/${post.user}`);
                            }}
                        >{`@${post.user}`}</span>
                        {post.title}
                    </div>
                    <div className="post-tags">
                        {
                            Object.values(post.tags).map((tag) => {
                                return <span># {tag} </span>
                            })
                        }
                    </div>
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
                                            }).catch(err => { alert(err) });
                                        }
                                        else {
                                            const newCommentRef = doc(collection(database, `comments/${DATA.comments}/comment`));
                                            setDoc(newCommentRef, newComment).then((res) => {
                                                alert('Comment Added Sucessfully.');
                                                setcommentForm(false);
                                            }).catch(err => {
                                                console.log(err);
                                            });
                                        }
                                    })
                                }}>Add</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <Comments postID={postID} />
        </div>
    )
}

export default Post;