import React from 'react';


export const Message = ({sender, message, isMyMessage, send_at}) => {
    console.log(isMyMessage);
    return (
        <div className={isMyMessage ? 'message-item my-message' : 'message-item'}>
            <div><b>{sender}</b>
                <i className={"messages-date"}>({send_at})</i></div>
            <span>{message}</span>
        </div>
    )
}
