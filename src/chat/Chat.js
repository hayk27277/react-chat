import React, {useEffect, useRef, useState} from 'react';

import axios from 'axios';
import {ChannelList} from './ChannelList';
import './chat.scss';
import {MessagesPanel} from './MessagesPanel';

const instance = axios.create({
    baseURL:  process.env.REACT_APP_SERVER_URL
});

instance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = 'Bearer ' + token;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export const Chat = () => {

    const [state, setState] = useState({
        channels: null,
        socket: null,
        channel: null
    })

    const socketRef = useRef(null);

    useEffect(() => {
        loadChannels();
        loadUser();
    }, [])


    const loadChannels = async () => {
        instance.get('/message-history').then(response => {
            setState((state) => ({...state, channels: response.data.data}));
        })
    }

    const loadUser = async () => {
        instance.get('/user').then(response => {
            setState((state) => ({...state, user: response.data.data}));
        })
    }

    const handleChannelSelect = async id => {
        let channel = state.channels.find(c => {
            return c.id === id;
        });

        const entity = channel.type === 'direct' ? 'user' : 'group';

        try {
            const response = (await instance.get(`/${entity}/${channel.messageable_id}/messages`))

            setState((state) => {
                let channel = state.channels.find(c => {
                    return c.id === id;
                });
                if(channel) {
                    const newChannel = {...channel}
                    newChannel.messages = response.data.data;
                    return ({...state, channel: newChannel})
                }
                return state
            })
        } catch (e) {
            alert(e.response.data.message);
        }
    }

    const handleChatSearch = event => {
        let search_query = event.target.value;

        if (search_query) {
            instance.get(`/search?search_query=${search_query}`).then(response => {
                setState((state) => {
                    const channels = response.data.data
                    channels.forEach((chanel, index) => {
                        chanel.id = index + 1
                    })
                    
                    return ({...state, channels})
                });
            })
        }
        else{
            loadChannels() 
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    const handleSendMessage = (channel_id, text) => {
        let channel = state.channels.find(c => {
            return c.id === channel_id;
        });

        const entity = channel.type === 'direct' ? 'user' : 'group';

        instance.post(`/${entity}/${channel.messageable_id}/messages`, {
            message: text
        }).then(() => {
            handleChannelSelect(channel.id)
        })

    }

    return (
        <div className='chat-app'>
            <ChannelList channels={state.channels} onSelectChannel={handleChannelSelect}
                         onChatSearch={handleChatSearch}/>
            <MessagesPanel onSendMessage={handleSendMessage} channel={state.channel}
                           user={state.user}/>
        </div>
    );
}