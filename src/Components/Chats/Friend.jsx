import React, { useState , useEffect} from 'react';
import './Friend.css';
import { getDocs, query, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onValue, push, ref, set } from "firebase/database";
import { database, realTimeDatabase } from '../../Helper/Firebase';
import Message from './Message';



function Friend({ username, pic, id }) {

    const selfID = JSON.parse(window.sessionStorage.getItem('user')).id;
    // selfIDs = selfID;
    // uid = id;
    const [activate, setactivate] = useState(false);
    const [sendTEXT, setsendTEXT] = useState('Send');
    const [message, setmessage] = useState({
        
    });
    const [chat, setChat] = useState([]);
    
    const loadMessages = async () => {

        const docRef = doc(database, "users_info", JSON.parse(window.sessionStorage.getItem('user')).id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const messageCommentsID = docSnap.data().messages;
            if (!messageCommentsID) {
                alert('No Chats');
                return;
            }
            const getAllMessagesQuery = query(collection(database, `messages/${messageCommentsID}/messerslist/${id}/message`));
            getDocs(getAllMessagesQuery).then((messageDocs) => {
                var list = [];
                messageDocs.forEach((message) => {
                    var messageData = message.data();
                    list.push(messageData);
                });
                list.sort((a, b) => a.created - b.created);
                setChat(list);
                console.log(chat);
            });
        } else {
            console.log("No such document!");
        }
    }

    const loadRealTimeChat = async () => {
        onValue(ref(realTimeDatabase, `${id}/${selfID}/messages`), (snapshot) => {
            const myChat = [];
             snapshot.forEach((msg) => {
                 myChat.push(msg.val());
             });
             myChat.sort((a, b) => a.created - b.created);
             setChat(myChat);
        });
    }


    useEffect(() => {
        onValue(ref(realTimeDatabase, `${id}/${selfID}/messages`), (snapshot) => {
           const myChat = [];
            snapshot.forEach((msg) => {
                myChat.push(msg.val());
            });
            myChat.sort((a, b) => a.created - b.created);
            setChat(myChat);
        });
    }, []);



    return (
        <div className='chat-item'>
            <div className="information"
                onClick={(e) => {
                    e.preventDefault();
                    if (!activate) {
                       // loadMessages();
                          loadRealTimeChat();
                    }
                    setactivate(!activate);

                }}
            >
                <div className="profile">
                    <img src={pic} alt='Profile Picture' />
                </div>
                <div className="friend-info">
                    <p className='user-name'>@{username}</p>
                    <p className='last-chat'>Are you coming ?</p>
                </div>
            </div>
            {
                activate
                    ?
                    <div className="chat-room">
                        <div className="messages-box">
                            {
                                chat && chat.map((msg) => {
                                    return <Message msg={msg} direction = { msg.from === selfID ? 'right' : 'left' } />
                                })
                            }
                        </div>
                        <div className="chat-form">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                // const userRef = doc(database, "users_info", selfID);
                                // setsendTEXT('Sending...');
                                // getDoc(userRef).then((snap) => {
                                //     const DATA = snap.data();
                                //     if (DATA.messages === '') {
                                //         const newMessageSection = doc(collection(database, 'messages'));
                                //         const newMessageRef = doc(collection(database, `${newMessageSection.path}/messerslist/${id}/message`));
                                //         setDoc(newMessageRef, message).then((res) => {
                                //             console.log(res);
                                //         }).catch(err => {
                                //             console.log(err);
                                //         });
                                //         updateDoc(userRef, {
                                //             messages: newMessageSection.id
                                //         }).then((res) => {
                                //             console.log('First Chat Added Sucessfully.');
                                //             setsendTEXT('Send');
                                //             loadMessages();
                                //         }).catch(err => { alert(err) });
                                //     }
                                //     else {
                                //         const newmessagesRef = doc(collection(database, `messages/${DATA.messages}/messerslist/${id}/message`));
                                //         setDoc(newmessagesRef, message).then((res) => {
                                //             console.log('Message Gone.');
                                //             setmessage({ ...message, ['content']: '' });
                                //             setsendTEXT('Send');
                                //             loadMessages();
                                //         }).catch(err => {
                                //             console.log(err);
                                //         });
                                //     }
                                // });

                                // setting in realtime database
                                const Ref = ref(realTimeDatabase, `${selfID}/${id}/messages`);
                                const newMessageRef = push(Ref);
                                const newMsg = message;
                                setmessage({...message, ['content'] : ''});
                                set(newMessageRef, newMsg).then((res) => {
                                    set(push(ref(realTimeDatabase, `${id}/${selfID}/messages`)), newMsg).then((res) => {
                                        console.log("DONE");
                                    });
                                });
                                // getting from realtime database
                                loadRealTimeChat();

                            }} >
                                <input onChange={(e) => {
                                    setmessage({ ...message, ['content']: e.target.value, ['from']: selfID, ['to']: id, ['created']: Date.now() })
                                }} value={message.content} type='text' placeholder='Message' />
                                <button type='submit'>{sendTEXT}</button>
                            </form>
                        </div>
                    </div>
                    :
                    <></>
            }
        </div>
    )
}

export default Friend