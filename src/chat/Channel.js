import React from 'react';

export const Channel = ({onClick, id, name, participants}) => {
    const handleClick = () => onClick(id);

    return (
        <div className='channel-item' onClick={handleClick}>
            <div>{name}</div>
            <span>{participants}</span>
        </div>
    )
}