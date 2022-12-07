import React from 'react';


export const Message = ({sender, message}) => {
    return (
        <div className='message-item'>
            <div><b>{sender}</b></div>
            <span>{message}</span>
        </div>
    )
}
