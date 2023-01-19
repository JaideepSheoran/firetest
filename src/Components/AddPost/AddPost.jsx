import './AddPost.css';

import React , {useState,useEffect} from 'react';
import {storage, database } from '../../Helper/Firebase';
import { useNavigate } from 'react-router-dom';
import { doc , collection , updateDoc , arrayUnion , query , where , getDocs} from 'firebase/firestore';
import { ref , uploadBytes , getDownloadURL } from 'firebase/storage';
import {useCookies} from 'react-cookie';

function AddPost() {
    const [cookies] = useCookies(['user']);
    const navigate = useNavigate();
    const [post, setPost] = useState({
        title : '',
        description : '',
        tags : [],
        url : '',
        likesCnt : 534
    });
    const [postImg , setPostImg ] = useState();
    const [tags , setTags] = useState('');

    useEffect(() => {
        if(!cookies.user){
          navigate('/login');
        }
    }, [cookies.user]);

    const handleClick = (e) => {
        e.preventDefault();
        try {
            if (!post.title || !post.description || !tags) {
                alert('Empty Fields ~~~');
                return;
            }
            if (!postImg) {
                alert('Choose Post ~~~');
                return;
            } else {
                var tagsTemp = tags;
                tagsTemp = tagsTemp.replaceAll(' ', '');
                var tagsArray = tagsTemp.split(',');
                tagsArray = tagsArray.filter((tag) => {return tag.length !== 0});
                var tempPost = post;
                tempPost.tags = tagsArray;
                setPost(tempPost);
                console.log(post);
                const dataQuery = query(collection(database, 'Users'), where('username', '==', `${cookies.user.username}`));
                getDocs(dataQuery).then((snapshot) => {
                    if(snapshot.docs.length === 1){
                        
                        uploadBytes(ref(storage, `${cookies.user.username}/${postImg.name}`), postImg).then((snap) => {
                            getDownloadURL(ref(storage, `${cookies.user.username}/${postImg.name}`)).then((url) => {
                                post.url = url;
                                updateDoc(doc(database , 'Users' , snapshot.docs[0].id), {
                                    posts: arrayUnion(post)
                                }).then((res) => {
                                    alert('Posted');
                                    navigate('/account/myaccount');
                                });
                            }).catch((error) => {
                                console.log(error);
                            });
                        });
                    }else{
                        alert('Database Error...');
                        return;
                    }
                })
            }
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost(prev => ({
            ...prev,
            [name]: value
        }));
    }


  return (
    <div className='addpost-container'>
        <form>
            <input onChange={handleChange} value={post.title} type="text" name='title' placeholder='Title' />
            <input onChange={handleChange} value={post.description} type="text" name='description' placeholder='Description' />
            <input onChange={(e) => {setTags(e.target.value)}} value={tags} type="text" name='tags' placeholder='Tags (Add Comma b/w tags ...)' />
            <input onChange={(e) => {setPostImg(e.target.files[0])}} type="file" name='url' />
            <button  onClick={handleClick} >Add Post</button>
        </form>
    </div>
  )
}

export default AddPost