import React from 'react';
import './Components.css';

export default ({id, character, active, clickHandler}) => (
    <div 
        className={`box ${active ? 'activeClass' : ''}`}
        onClick={() => clickHandler(id)}
    >
        {character}
    </div>
)
    

