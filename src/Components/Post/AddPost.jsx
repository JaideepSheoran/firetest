import './AddPost.css';
import React, { useState } from 'react';
import { storage, database } from '../../Helper/Firebase';
import { useNavigate } from 'react-router-dom';
import { doc, collection, updateDoc, arrayUnion, query, where, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


function AddPost() {

    const navigate = useNavigate();
    const user = JSON.parse(window.sessionStorage.getItem('user'));
    const [postImg, setPostImg] = useState();
    const [tags, setTags] = useState('');
    const [addPostText, setaddPostText] = useState('Add Post');
    const [post, setPost] = useState({
        username : user.username,
        caption: '',
        tags: [],
        location: '',
        url: '',
        likesCnt: 0,
        comments: '' // changed
    });
    const handleCrossClick = (e) => {
        e.preventDefault();
        navigate('/account/myaccount');
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleClick = (e) => {
        e.preventDefault();
        try {
            if (!post.caption || !post.location || !tags) {
                alert('Empty Fields ~~~');
                return;
            }
            if (!postImg) {
                alert('Choose Post ~~~');
                return;
            } else {
                setaddPostText('Uploading...');
                var tagsTemp = tags;
                tagsTemp = tagsTemp.replaceAll(' ', '');
                var tagsArray = tagsTemp.split(',');
                tagsArray = tagsArray.filter((tag) => { return tag.length !== 0 });
                var tempPost = post;
                tempPost.tags = tagsArray;
                setPost(tempPost);
                console.log(post);
                const dataQuery = query(collection(database, 'users_info'), where('username', '==', `${user.username}`));
                getDocs(dataQuery).then((snapshot) => {
                    if (snapshot.docs.length === 1) {

                        uploadBytes(ref(storage, `${user.username}/${postImg.name}`), postImg).then((snap) => {
                            getDownloadURL(ref(storage, `${user.username}/${postImg.name}`)).then((url) => {
                                post.url = url;
                                const data = snapshot.docs[0].data();
                                console.log(data);
                                if (data.posts === '') {
                                    console.log('THIS IS RUNNING....');
                                    // create a new document in posts collection
                                    addDoc(collection(database, 'post'), post).then((docRef) => {
                                        const docID = docRef.id;
                                        addDoc(collection(database, 'posts'), { postsID: [docID] }).then((postRef) => {
                                            const postRefID = postRef.id;
                                            console.log(postRefID, snapshot.docs[0].id);
                                            const myRef = doc(database, 'users_info', snapshot.docs[0].id);
                                            updateDoc(myRef, {
                                                posts: postRefID
                                            }).then((res) => {
                                                alert('First Post Added Sucessfully.');
                                                setaddPostText('Add Post');
                                            }).catch(err => { alert(err) });
                                        })
                                    });
                                } else {
                                    addDoc(collection(database, 'post'), post).then((docRef) => {
                                        const docID = docRef.id;
                                        const myRef = doc(database, 'posts', data.posts);
                                        updateDoc(myRef, {
                                            postsID: arrayUnion(docID)
                                        }).then((res) => {
                                            alert('Post Done.');
                                            setaddPostText('Add Post');
                                        })
                                    });
                                }
                            }).catch((error) => {
                                console.log(error);
                            });
                        });
                    } else {
                        alert('Database Error...');
                        return;
                    }
                })
            }
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }


    const setImagePreview = (file) => {
        document.getElementById('preview').src = URL.createObjectURL(file);
        console.log('DONE');
    }

    return (
        <div className='addpost-body'>
            <div className="addpost-cross" onClick={handleCrossClick} >X</div>
            <div className="addpost-container">
                <div className="addpost-title">
                    <p>Create New Post</p>
                    <button onClick={handleClick} >{addPostText}</button>
                </div>
                <div className="addpost-post-container">
                    <div className="post-selector">
                        <input onChange={(e) => { setImagePreview(e.target.files[0]); setPostImg(e.target.files[0]); }} type="file" name='url' />
                        <div className="imagediv">
                            <img alt='User' id='preview' width="100%" />
                        </div>
                    </div>
                    <div className="post-details">
                        <div className="userinfo-box">
                            <div className="user-img">
                                <img src={user.url} alt='Nothing' className='user-img-img' />
                            </div>
                            <div className="username">
                                {user.username}
                            </div>
                        </div>
                        <div className="post-caption">
                            <p>Caption</p>
                            <textarea placeholder='Add caption ...' onChange={handleChange} value={post.caption} name="caption" id="" cols="30" rows="10"></textarea>
                        </div>
                        <div className="posttags">
                            <p>Add Tags</p>
                            <textarea placeholder='Add Tags ...' onChange={(e) => { setTags(e.target.value) }} value={tags} name="tags" id="" cols="30" rows="10"></textarea>
                        </div>
                        <div className="post-location">
                            <p>Add Location</p>
                            <input placeholder='Add Location ...' onChange={handleChange} name='location' value={post.location} type="text" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddPost