import React, { useState } from 'react';
import './Register.css';
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { database } from "../Helper/Firebase";
import { storage } from '../Helper/Firebase';
import Pic from '../Assets/logo192.png';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Link, useNavigate } from "react-router-dom";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function Register() {

    const [user, setUser] = useState({
        username: '',
        fname: '',
        lname: '',
        email: '',
        password: '',
        posts: [],
        url: ''
    });
    const navigate = useNavigate();
    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState({ aspect: 1 , circularCrop : true });
    const [image, setImage] = useState(null);
    const [output, setOutput] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
        console.log(user);
    }

    const selectImage = (file) => {
        setSrc(URL.createObjectURL(file));
        setOutput(URL.createObjectURL(file));
    }

    const cropImageNow = () => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        const pixelRatio = window.devicePixelRatio;
        canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
        canvas.height = Math.floor(crop.height * scaleY * pixelRatio)
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        // ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
        );

        // Converting to base64
        const base64Image = canvas.toDataURL('image/jpeg');
        setOutput(base64Image);
        console.log(output);
    };

    const handleClick = async (e) => {
        e.preventDefault();
        // register user
        try {
            if (!user.username || !user.fname || !user.lname || !user.email || !user.password) {
                alert('Empty Fields ~~~');
                return;
            }
            if (!output) {
                alert('Add Profile Photo ~~~');
                return;
            } else {
                const dataQuery = query(collection(database, 'Users'), where('username', '==', `${user.username}`));
                getDocs(dataQuery).then((snapshot) => {
                    if (snapshot.docs.length === 0) {
                        uploadBytes(ref(storage, `images/${user.username}`), output).then((snap) => {
                            getDownloadURL(ref(storage, `images/${user.username}`)).then((url) => {
                                user.url = url;
                                addDoc(collection(database, "Users"), user).then((docRef) => {
                                    setUser({ username: '', fname: '', lname: '', email: '', password: '', url: '' });
                                    alert(`Registered Successfully ~~~ ${docRef.id}`);
                                    navigate('/login');
                                });
                            }).catch((error) => {
                                console.log(error);
                            });
                        });
                    } else {
                        alert('Username Already Taken');
                        return;
                    }
                })
            }
        } catch (e) {
            console.error("Error adding document: ", e);
        }

    }

    return (
        <div className='container'>
            <div className="form-container">
                <form className="user-form" id='user-info'>
                    <input value={user.username} onChange={handleChange} placeholder='Unique Username' type="text" name="username" id="username" />
                    <input value={user.fname} onChange={handleChange} placeholder='First Name' type="text" name="fname" id="userfname" />
                    <input value={user.lname} onChange={handleChange} placeholder='Last Name' type="text" name="lname" id="userlname" />
                    <input value={user.email} onChange={handleChange} placeholder='Email' type="email" name="email" id="useremail" />
                    <input value={user.password} onChange={handleChange} placeholder='Password' type="password" name="password" id="userpass" />
                    <div className="form-buttons">
                        <button onClick={handleClick} id='formbtn'>Register</button>
                        <Link to='/login'>Already have an Account ?</Link>
                    </div>
                </form>
            </div>
            <div className="profile-photo">
                <div className="photo-container">
                    <div className="userimage">
                        {output ? <img src={output} alt="Profie Pic" /> : <img src={Pic} alt="Profie Pic" />}
                    </div>
                    <div id='setprofile'>
                        Add Profile Photo
                        <input type="file" onChange={(e) => { selectImage(e.target.files[0]) }} className="hide_file" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;