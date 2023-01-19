import React from 'react';
import './Gallary.css';
import { useState } from 'react';
import { storage, storageRef } from '../Helper/Firebase';
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';

function Gallary({ user }) {
    const [pictures, setPictures] = useState([]);
    const [allSet, setAllSet] = useState(true);
    const [file, setFile] = useState([]);
    const [uploadText, setUploadText] = useState('Upload');


    return (

        <div className='userform'>
            <div className='grid-container'>
                {
                    allSet && user.map((item) => {
                        return <div key={item.caption} ><img src={item.url} alt="OK" /></div>;
                    })
                }
            </div>
        </div>
    );
}

export default Gallary;