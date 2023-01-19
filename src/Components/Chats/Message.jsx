import React from 'react';
import './Message.css';

function Message({ msg , direction }) {
    return (
        <div className='message-box' >
            <div className="message-balti" style={{float : direction , backgroundColor : direction === 'left' ? '#000000' : '#000000'}}>
                <p className='msg-content' style={{backgroundColor : direction === 'left' ? '#333333' : '#0158b6'}}>{msg.content}</p>
                <p className='r-time'>{new Date(msg.created).toLocaleString('en-US')}</p>
            </div>
        </div>
    )
}

export default Message;