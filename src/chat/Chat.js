import React from 'react';
import axios from 'axios';
import {ChannelList} from './ChannelList';
import './chat.scss';
import {MessagesPanel} from './MessagesPanel';

const SERVER = "http://127.0.0.1:8085/api";

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
        axios.get(SERVER + '/message-history').then(response => {
            this.setState({channels: response.data.data});
        })
    }

    loadUser = async () => {
        axios.get(SERVER + '/user').then(response => {
            this.setState({user: response.data.data});
        })
    }

    handleChannelSelect = id => {
        let channel = this.state.channels.find(c => {
            return c.id === id;
        });

        const entity = channel.type === 'direct' ? 'user' : 'group';

        axios.get(`${SERVER}/${entity}/${channel.messageable_id}/messages`).then(response => {
            channel.messages = response.data.data;
        })

        this.setState({channel});
    }

    handleSendMessage = (channel_id, text) => {
        let channel = this.state.channels.find(c => {
            return c.id === channel_id;
        });

        const entity = channel.type == 'direct' ? 'user' : 'group';

        axios.post(`${SERVER}/${entity}/${channel.messageable_id}/messages`, {
            message: text
        }).then(response => {
            console.log(response.data);
        })

    }

    render() {
        return (
            <div className='chat-app'>
                <ChannelList channels={this.state.channels} onSelectChannel={this.handleChannelSelect}/>
                <MessagesPanel onSendMessage={this.handleSendMessage} channel={this.state.channel} user={this.state.user}/>
            </div>
        );
    }
}