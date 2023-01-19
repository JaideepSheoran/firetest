import './Chats.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Friend from './Friend';
import {database} from '../../Helper/Firebase';
import {getDocs, query , collection} from 'firebase/firestore';

function Chats({ logged, setlogged }) {
    const navigate = useNavigate();
    const [friends, setfriends] = useState([]);
    useEffect(() => {
        if (!window.sessionStorage.getItem('user')) {
            navigate('/login');
            return;
        }else{
            loadFriendsData();
            console.log("DONE");
        }
    }, []);

    const loadFriendsData = () => {
        var users = [];
        const allUsers = query(collection(database, 'users_info'));
        getDocs(allUsers).then((snap) => {
            snap.forEach((doc) => {
                var data = doc.data();
                data['id'] = doc.id;
                users.push(data);
            });
            setfriends(users);
        })

    }

    return (
        <div className='chat-section'>
            <div className="chat-header">
                <p>Chats</p>
            </div>
            <div className="chat-body">
                {
                    friends && friends.map((user) => {
                        return <Friend username = {user.username} pic = {user.url} id = {user.id} />
                    })
                }
            </div>
        </div>
    )
}

export default Chats;