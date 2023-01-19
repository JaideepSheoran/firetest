import './Login.css';
import React, {useState} from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { database } from "../../Helper/Firebase";
import {Link, useNavigate} from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [loginDetails, setLoginDetails] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginDetails(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleClick = (e) => {
        e.preventDefault();
        if(!loginDetails.username || !loginDetails.password){
            alert('Empty Fields ~~~');
            return;
        }
        const dataQuery = query(
            collection(database, 'users_info'),
            where('username' , '==' , `${loginDetails.username}`),
            where('password' , '==' , `${loginDetails.password}`)
        );
        getDocs(dataQuery).then((snap) => {
            if(snap.docs.length === 1){
                var userData = snap.docs[0].data();
                userData['id'] = snap.docs[0].id;
                console.log(userData);
                window.sessionStorage.setItem('user', JSON.stringify(userData));
                alert('User Found');
                console.log(JSON.parse(window.sessionStorage.getItem('user')));
                navigate('/account/myaccount');
            }else{
                alert('Not Found');
            }
        })
    }

    return (
        <div className='container'>
            <div className="form-container">
                <form className="user-form" id='user-info'>
                    <input value={loginDetails.username} onChange={handleChange} placeholder='Unique Username' type="text" name="username" id="username" />
                    <input value={loginDetails.password} onChange={handleChange} placeholder='Password' type="password" name="password" id="userpass" />
                    <div className="form-buttons">
                        <button onClick={handleClick} id='formbtn'>Login</button>
                        <Link to='/register'>Don't have an Account ?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;