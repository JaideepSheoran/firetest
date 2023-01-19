import './Account.css';
import React, { useState, useEffect } from 'react';
import Gallary from '../Gallary';
import { useNavigate } from "react-router-dom";
import Pic from '../../Assets/logo192.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faChessQueen } from "@fortawesome/free-solid-svg-icons";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { database } from '../../Helper/Firebase';
import { doc, getDocs, where, query, collection, getDoc, updateDoc, setDoc, arrayUnion } from 'firebase/firestore';

function Account({ userName }) {

    const [totalPosts, settotalPosts] = useState(0);
    const [follow , setFollow] = useState({
        followers : 0,
        following : 0
    });
    const [text, setText] = useState('Follow');
    const [disable, setDisable] = useState(false);
    const [user, setUser] = useState(JSON.parse(window.sessionStorage.getItem('user')));
    const [isuserDataSet, setisUserdataSet] = useState(false);
    const [allPosts, setallPosts] = useState([]);
    const [timer, setTimer] = useState(2000);


    setTimeout(() => {
        if (!isuserDataSet) {
            loadData();
        }
    }, 2000);


    const loadData = async () => {
        if (userName) {
            console.log(userName);
            const QUERY = query(collection(database, 'users_info'), where('username', '==', userName));
            const QUERY_2 = query(collection(database, 'users_info'), where('username', '==', user.username));
            getDocs(QUERY).then((snap) => {
                const otheruser = snap.docs[0].data();
                setFollow({
                    followers : otheruser.followers.followersCnt,
                    following : otheruser.following.followingCnt
                });
                const userPostsID = otheruser.posts;
                const docRef = doc(database, 'posts', userPostsID);
                getDoc(docRef).then((snap) => {
                    if (!snap.exists()) {
                        throw new Error('Not Found');
                    }
                    const snapData = snap.data();
                    settotalPosts(snapData.postsID.length);
                    setUser(otheruser);
                    runSync(snapData.postsID, 0);
                    setisUserdataSet(true);
                    setTimer(10000000000);

                }).catch(err => { alert(err) });
            }).catch(err => {
                return new Error('ERROR : JD');
            });

            getDocs(QUERY_2).then((snap) => {
                const data = snap.docs[0].data();
                getDoc(doc(database, 'following' , data.following.followingDocID)).then((snapshot) => {
                    if(snapshot.exists())
                    {
                        const followingData = snapshot.data().followingList;
                        followingData.forEach(follow => {
                            if(follow.username === userName)
                            {
                                setText('Following');
                                setDisable(true);
                            }
                        });
                    }
                })
            })

        } else {
            getDoc(doc(database, 'users_info' , user.id)).then((document) => {
                if(document.exists())
                {
                    const DATA = document.data();
                    getDoc(doc(database, 'posts' , DATA.posts)).then((snap) => {
                        if (!snap.exists()) {
                            throw new Error('Not Found');
                        }
                        const snapData = snap.data();
                        settotalPosts(snapData.postsID.length);
                        setFollow({
                            followers : DATA.followers.followersCnt,
                            following : DATA.following.followingCnt
                        });
                        runSync(snapData.postsID, 0);
                        setisUserdataSet(true);
                        setTimer(10000000000);
        
                    }).catch((err) => { alert(err) });        
                }   
            })
        }
    }

    const runSync = (data, i) => {
        if (i == data.length) {
            console.log(allPosts);
            return;
        }
        const postRef = doc(database, 'post', data[i]);
        getDoc(postRef).then((snap) => {
            const postData = snap.data();
            setallPosts(prevState => [...prevState, postData]);

            runSync(data, i + 1);
        }).catch(err => { alert(err) });

    }

    const setFollowers = (e) => {
        e.preventDefault();
        const ID = JSON.parse(window.sessionStorage.getItem('user')).id;
        const QUERY = query(collection(database, 'users_info'), where('username', '==', userName));

        getDocs(QUERY).then((userData) => {
            if (userData.docs.length == 1) {
                const DATA = userData.docs[0].data();
                const IDS = userData.docs[0].id;
                console.log(DATA);
                if (DATA.followers.followersDocID === '') {
                    const newDocRef = doc(collection(database, "followers"));
                    const cData = JSON.parse(window.sessionStorage.getItem('user'));
                    console.log(newDocRef.id);
                    setDoc(doc(database, "followers", newDocRef.id), {
                        followList: [{
                            username: cData.username,
                            id: cData.id,
                            url: cData.url
                        }]
                    }).then((res) => {
                        updateDoc(doc(database, 'users_info', IDS), {
                            "followers.followersCnt": DATA.followers.followersCnt + 1,
                            "followers.followersDocID": newDocRef.id
                        }).then(res => { console.log(res); setDisable(true); setText('Following');}).catch(err => { console.log(err); })
                    }).catch(err => {
                        console.log(err);
                    });
                }
                else {
                    const docRef = doc(database, "followers", DATA.followers.followersDocID);
                    const cData = JSON.parse(window.sessionStorage.getItem('user'));
                    updateDoc(docRef, {
                        followList: arrayUnion({
                            username: cData.username,
                            id: cData.id,
                            url: cData.url
                        })
                    }).then(res => {
                        updateDoc(doc(database, 'users_info', IDS), {
                            "followers.followersCnt": DATA.followers.followersCnt + 1
                        }).then(res => { console.log(res); setDisable(true); setText('Following'); }).catch(err => { console.log(err); })
                    }).catch(err => { console.log(err); });
                }
            }
        }).catch(err => { console.log(err); });

        getDoc(doc(database, 'users_info', ID)).then((snap) => {
            if (snap.exists()) {
                const DATA = snap.data();
                const QUERY = query(collection(database, 'users_info'), where('username', '==', userName));
                getDocs(QUERY).then((userDocs) => {
                    if (userDocs.docs.length === 1) {
                        const DATA_NEW = userDocs.docs[0].data();
                        const NEW_DOCID = userDocs.docs[0].id;
                        if (DATA.following.followingDocID === '') {
                            const newDocRef = doc(collection(database, "following"));
                            setDoc(doc(database, "following", newDocRef.id), {
                                followingList: [{
                                    username: DATA_NEW.username,
                                    id: NEW_DOCID,
                                    url: DATA_NEW.url
                                }]
                            }).then((res) => {
                                updateDoc(doc(database, 'users_info', snap.id), {
                                    "following.followingCnt": DATA.following.followingCnt + 1,
                                    "following.followingDocID": newDocRef.id
                                }).then(res => { console.log(res); }).catch(err => { console.log(err); })
                            }).catch(err => {
                                console.log(err);
                            });
                        } else {
                            const docRef = doc(database, "following", DATA.following.followingDocID);
                            updateDoc(docRef, {
                                followingList: arrayUnion({
                                    username: DATA_NEW.username,
                                    id: NEW_DOCID,
                                    url: DATA_NEW.url
                                })
                            }).then(res => {
                                updateDoc(doc(database, 'users_info', snap.id), {
                                    "following.followingCnt": DATA.following.followingCnt + 1
                                }).then(res => { console.log(res); }).catch(err => { console.log(err); })
                            }).catch(err => { console.log(err); });
                        }

                    }
                });
            }
        })
    }



    return (
        isuserDataSet
            ?
            <>
                <div className="account-container">
                    <div className="account-header">
                        <div className="account-userinfo">
                            <div className="account-user">
                                <img height='100px' src={user.url} alt="Pic" />
                            </div>
                            <div className="account-details">
                                <div className="account-posts">
                                    <div className="account-postcnt">{totalPosts}</div>
                                    <p>Posts</p>
                                </div>
                                <div className="account-followers">
                                    <div className="account-postcnt">{follow.followers}</div>
                                    <p>Followers</p>
                                </div>
                                <div className="account-following">
                                    <div className="account-postcnt">{follow.following}</div>
                                    <p>Following</p>
                                </div>
                                {
                                    userName
                                    ?
                                    <div className="follow-btn">
                                        <button disabled={disable} onClick={setFollowers} >{text}</button>
                                    </div>
                                    :
                                    <>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="account-description">
                            <div className="account-flname">
                                <FontAwesomeIcon style={{ paddingRight: '10px' }} icon={faChessQueen} />
                                {user.fname} {user.lname}
                            </div>
                            <div className="account-username">
                                <FontAwesomeIcon style={{ paddingRight: '10px' }} icon={faUserTie} />
                                @{user.username}
                            </div>
                            <div className="account-email">
                                <FontAwesomeIcon style={{ paddingRight: '10px' }} icon={faEnvelope} />
                                {user.email}
                            </div>
                        </div>
                    </div>
                    <div className="account-containerbody">
                        {
                            <Gallary user={allPosts} />
                        }
                    </div>
                </div>
            </>
            :
            <>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: '20%' }} className="fa-3x">
                    <i className="fa-solid fa-cog fa-spin"></i>
                </div>
            </>
    )
}

export default Account