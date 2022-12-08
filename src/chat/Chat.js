import React from 'react';
import axios from 'axios';
import {ChannelList} from './ChannelList';
import './chat.scss';
import {MessagesPanel} from './MessagesPanel';
import socketClient from "socket.io-client";

const SOCKET_SERVER = "http://127.0.0.1:8088";
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
        this.configureSocket();
    }

    configureSocket = () => {
        const socket = socketClient(SOCKET_SERVER);
        socket.on('connection', () => {
            if (this.state.channel) {
                this.handleChannelSelect(this.state.channel.id);
            }
        });
        socket.on('channel', channel => {

            let channels = this.state.channels;
            channels.forEach(c => {
                if (c.id === channel.id) {
                    c.participants = channel.participants;
                }
            });
            this.setState({channels});
        });
        socket.on('message', message => {

            let channels = this.state.channels
            channels.forEach(c => {
                if (c.id === message.channel_id) {
                    if (!c.messages) {
                        c.messages = [message];
                    } else {
                        c.messages.push(message);
                    }
                }
            });
            this.setState({channels});
        });
        this.socket = socket;
    }

    loadChannels = async () => {
        axios.get(SERVER + '/message-history').then(response => {
            this.setState({channels: response.data.data});
        })
    }

    handleChannelSelect = id => {
        let channel = this.state.channels.find(c => {
            return c.id === id;
        });
        if(channel.type == 'direct'){
            axios.get(`${SERVER}/user/${channel.messageable_id}/messages`).then(response => {
                channel.messages = response.data.data;
            })
        }
        else{
            axios.get(`${SERVER}/group/${channel.messageable_id}/messages`).then(response => {
                channel.messages = response.data.data;
            })
        }

        this.setState({channel});
        this.socket.emit('channel-join', id, ack => {
        });
    }

    handleSendMessage = (channel_id, text) => {
        let channel = this.state.channels.find(c => {
            return c.id === channel_id;
        });

        if(channel.type == 'direct'){
            axios.post(`${SERVER}/user/${channel.messageable_id}/messages`, {
                message: text
            }).then(response => {
                console.log(response.data);
            })
        }else {
            axios.post(`${SERVER}/group/${channel.messageable_id}/messages`, {
                message: text
            }).then(response => {
                console.log(response.data);
            })
        }

    }

    render() {
        return (
            <div className='chat-app'>
                <ChannelList channels={this.state.channels} onSelectChannel={this.handleChannelSelect}/>
                <MessagesPanel onSendMessage={this.handleSendMessage} channel={this.state.channel}/>
            </div>
        );
    }
}