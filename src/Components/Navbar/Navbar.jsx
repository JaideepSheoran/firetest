import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import {useCookies} from 'react-cookie';

function Navbar() {
    const navigate = useNavigate();
    return (
        <div className='navbar'>
            <div className="logo">
                <Link to='/'><img height='50px' src='https://www.freepnglogos.com/uploads/logo-ig-png/logo-ig-logo-abundant-instagram-logo-simple-icon-1.png' alt="Logo" /></Link>
            </div>
            <div className="item-container">
                <ul className="item-list">
                    <li className="item">
                        <Link className='itemlink' to='/'>
                            <FontAwesomeIcon className='icon' icon={faHouse} />
                        </Link>
                    </li>
                    <li className="item">
                        <Link className='itemlink' to='/account/myaccount'>
                            <FontAwesomeIcon className='icon' icon={faUser} />
                        </Link>
                    </li>
                    <li className="item">
                        <Link className='itemlink' to='/chats'>
                            <FontAwesomeIcon className='icon' icon={faMessage} />
                        </Link>
                    </li>
                    <li className="item">
                        <Link className='itemlink' to='/addpost'>
                            <FontAwesomeIcon className='icon' icon={faCirclePlus} />
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="user-info">
                {
                    window.sessionStorage.getItem('user') 
                    ?
                     <>
                        <button onClick={
                            (e) => {
                                e.preventDefault();
                                window.sessionStorage.removeItem('user');
                                navigate('/login');
                            }
                        } ><FontAwesomeIcon className='navbar-rgs' icon={faRightFromBracket} /></button>
                     </>
                    :
                    <>
                        <Link className='navbar-rgs' to='/register'>Register</Link>
                        /
                        <Link className='navbar-rgs' to='/login'>Login</Link>
                    </>
                }
            </div>
        </div>
    )
}

export default Navbar