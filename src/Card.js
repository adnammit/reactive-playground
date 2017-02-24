import React, { Component, PropTypes } from 'react';
import './Card.css';

class Card extends Component {
    render() {
        const faceDown = !this.props.matched && this.props.isFaceDown
        return( 
            <div className={ faceDown ? 'card face-down' : 'card face-up' }
                onClick={this.props.onClick}>
                    <p>{this.props.value}</p>
            </div>
        );
    }
}

Card.propTypes = {
    value: PropTypes.string,
    id: PropTypes.number,
    isFaceDown: PropTypes.bool,
    matched: PropTypes.bool,
    onClick: PropTypes.func
}

export default Card;