import React from "react";
import { Channel } from "./Channel";

export const ChannelList = ({onSelectChannel, channels, onChatSearch}) => {
    const handleClick = (id) => onSelectChannel(id);
    const handleChatSearch = (event) => onChatSearch(event);

    return (
        <div className="channel-list">
            <input type="text" onInput={handleChatSearch} className="channel-search" placeholder="search..."/>
            {channels && channels.map ? (
                channels.map((c) => (
                    <Channel
                        key={c.id}
                        id={c.id}
                        name={c.name}
                        participants={c.participants}
                        onClick={handleClick}
                    />
                ))
            ) : (
                <div className="no-content-message">There is no channels to show</div>
            )}
        </div>
    );
};