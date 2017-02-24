// All credit to https://codepen.io/haniotis/pen/KwvYLO

import React, { Component } from 'react';
import './Checkmark.css';

export default class Checkmark extends Component {
    render() {
        return(
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="circle" cx="26" cy="26" r="25"/>
                <path className="check" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
        )
    }  
}