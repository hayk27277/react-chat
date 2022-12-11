import React, {Component, useEffect} from 'react';

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

export class Chat extends React.Component {

    state = {
        channels: null,
        socket: null,
        channel: null
    }
    socket;

    componentDidMount() {
        this.loadChannels();
        this.loadUser();
    }


    loadChannels = async () => {
        instance.get('/message-history').then(response => {
            this.setState({channels: response.data.data});
        })
    }

    loadUser = async () => {
        instance.get('/user').then(response => {
            this.setState({user: response.data.data});
        })
    }

    handleChannelSelect = async id => {
        let channel = this.state.channels.find(c => {
            return c.id === id;
        });

        const entity = channel.type === 'direct' ? 'user' : 'group';

        try {
            const response = (await instance.get(`/${entity}/${channel.messageable_id}/messages`))

            channel.messages = response.data.data;

            this.setState({channel});
        } catch (e) {
            alert(e.response.data.message);
        }
    }

    handleChatSearch = event => {
        let search_query = event.target.value;

        if (search_query) {
            instance.get(`/search?search_query=${search_query}`).then(response => {
                const channels = response.data.data
                channels.map((chanel, index) => {
                    chanel.id = index + 1
                })
                this.setState({channels});
            })
        }
    }

    handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    handleSendMessage = (channel_id, text) => {
        let channel = this.state.channels.find(c => {
            return c.id === channel_id;
        });

        const entity = channel.type === 'direct' ? 'user' : 'group';

        instance.post(`/${entity}/${channel.messageable_id}/messages`, {
            message: text
        }).then(() => {
            this.handleChannelSelect(channel.id)
        })

    }

    render() {
        return (
            <div className='chat-app'>
                <ChannelList channels={this.state.channels} onSelectChannel={this.handleChannelSelect}
                             onChatSearch={this.handleChatSearch}/>
                <MessagesPanel onSendMessage={this.handleSendMessage} channel={this.state.channel}
                               user={this.state.user}/>

                <span onClick={this.handleLogout}>
                    Logout
                </span>
            </div>
        );
    }
}