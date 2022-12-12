import React, { useState } from 'react';
import { Message } from './Message';

export const MessagesPanel = (props) => {
    const [state, setState] = useState({ input_value: '' })
    const {
        onSendMessage,
        channel,
        user,
    } = props

    const send = () => {
        if (state.input_value && state.input_value !== '') {
            onSendMessage(channel.id, state.input_value);
            setState({ input_value: '' });
        }
    }

    const handleInput = e => {
        setState({ input_value: e.target.value });
    }

    let list = <div className="no-content-message">There is no messages to show</div>;
    if (channel && channel.messages) {
        list = channel.messages.map(m =>
            <Message
                key={m.id}
                id={m.id}
                sender={m.sender}
                send_at={m.send_at}
                message={m.message}
                isMyMessage={m.sender_id === user.id}
            />);
    }

    return (
        <div className='messages-panel'>
            <div className="messages-list">{list}</div>
            {channel &&
                <div className="messages-input">
                    <input type="text" onChange={handleInput} value={state.input_value} />
                    <button onClick={send}>Send</button>
                </div>
            }
        </div>
    );
}
