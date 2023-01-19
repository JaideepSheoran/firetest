import './Account.css';
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Gallary from '../Gallary';
import { useNavigate } from "react-router-dom";
import Pic from '../../Assets/logo192.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faChessQueen } from "@fortawesome/free-solid-svg-icons";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { database } from '../../Helper/Firebase';
import { getDocs, where, query, collection } from 'firebase/firestore';

function Account({username}) {

    const [totalPosts, settotalPosts] = useState(0);
    const [cookies] = useCookies(['user']);
    const [userData, setUserdata] = useState({
        fname: '', lname: '', email: '', password: '', posts: [], url: '', username: ''
    });
    const [isuserDataSet, setisUserdataSet] = useState(false);
    const [timer, setTimer] = useState(2000);
    const navigate = useNavigate();


    useEffect(() => {
        loadData();
    }, [])

    const loadData = () => {
        const userName = !username ? cookies.user.username : username;
        const dataQuery = query(
            collection(database, 'Users'),
            where('username', '==', `${userName}`)
        );
        getDocs(dataQuery).then((snap) => {
            if (snap.docs.length === 1) {
                const snapData = snap.docs[0].data();
                setUserdata({
                    fname: snapData.fname, lname: snapData.lname, email: snapData.email, password: snapData.password, posts: snapData.posts, url: snapData.url, username: snapData.username
                });
                setisUserdataSet(true);
                console.log('Running');
                settotalPosts(snapData.posts.length);
                setTimer(100000000000);
            }
        });
    }

    setTimeout(loadData, timer);


    return (
        isuserDataSet
            ?
            <>
                <div className="account-container">
                    <div className="account-header">
                        <div className="account-userinfo">
                            <div className="account-user">
                                <img height='100px' src={userData.url} alt="Pic" />
                            </div>
                            <div className="account-details">
                                <div className="account-posts">
                                    <p>Posts</p>
                                    <div className="account-postcnt">{totalPosts}</div>
                                </div>
                                <div className="account-followers">
                                    <p>Followers</p>
                                    <div className="account-postcnt">1.3M</div>
                                </div>
                                <div className="account-following">
                                    <p>Following</p>
                                    <div className="account-postcnt">543</div>
                                </div>
                            </div>
                        </div>
                        <div className="account-description">

                            <div className="account-flname">
                                <FontAwesomeIcon style={{ paddingRight: '10px' }} icon={faChessQueen} />
                                {userData.fname} {userData.lname}
                            </div>
                            <div className="account-username">
                                <FontAwesomeIcon style={{ paddingRight: '10px' }} icon={faUserTie} />
                                @{userData.username}
                            </div>
                            <div className="account-email">
                                <FontAwesomeIcon style={{ paddingRight: '10px' }} icon={faEnvelope} />
                                {userData.email}
                            </div>
                        </div>
                    </div>
                    <div className="account-containerbody">
                        {
                            <Gallary user={userData} />
                        }
                    </div>
                </div>
            </>
            :
            <>
                <div style={{display:'flex', alignItems:'center', flexDirection : 'row' , justifyContent : 'center' , marginTop : '20%'}} class="fa-3x">
                    <i class="fa-solid fa-cog fa-spin"></i>
                </div>
            </>
    )
}

export default Account