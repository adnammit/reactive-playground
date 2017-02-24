// This is heavily inspired from 
// https://github.com/jdlehman/react-memory-game/blob/master/src/components/Game.js

import React, { Component } from 'react';
import _ from 'lodash';
import Card from './Card';
import Checkmark from './Checkmark';
import './Board.css';

class Board extends Component {
    constructor(props){
        super(props)
        let values = ['⏰', '☔', '☕', '🍄']
        let cardSet = _.map(_.flatten([values, values]), (c, i) => {
            return {id: i, value: c, isFaceDown: true, matched: false}
        })
        this.state = { 
            cards: _.shuffle(cardSet),
            lastFlippedCard: null,
        }
    }

    render() {
        return(
            <div className="board">
                <div className="container">
                    {this.renderCards(this.state.cards)}
                </div>
                <button onClick={this.handleResetClick}>Reset</button>
            </div>
        )
    } 

    handleCardClick = (index, card) => { 
        let cardFlipped = this.state.cards[index]
        var lastCard = this.state.lastFlippedCard 

        if(this.state.locked || !cardFlipped.isFaceDown) return

        cardFlipped.isFaceDown = false

        if(lastCard == null) 
        {
            this.setLastFlippedCard(cardFlipped)       
            return
        }
        
        this.setState({ locked: true })
            
        let isSameCard = lastCard.id === cardFlipped.id 
        let alreadyMatchedCard = lastCard.matched || cardFlipped.alreadyMatchedCard
        let hasMatch = !isSameCard 
                    && !alreadyMatchedCard 
                    && lastCard.value === cardFlipped.value

        if(hasMatch) 
        {
            lastCard.matched = true
            cardFlipped.matched = true
        }

        setTimeout(() => {
            _.forEach([cardFlipped, lastCard], (card) => {
                card.isFaceDown = !hasMatch
                card.matched = hasMatch
            }) 
            this.setState({ 
                locked: false, 
                lastFlippedCard: null 
            })
        }, 500)
    }

    handleResetClick = () => {
        _.forEach(this.state.cards, (card) => {
            card.isFaceDown = true
            card.matched = false
        })
       this.setLastFlippedCard(null)
    }

    setLastFlippedCard = (card) => {
        this.setState({
            lastFlippedCard: card 
        })
    }

    renderCards(cards) {
        return cards.map((card, id) => 
            <div key={id}>
                <Card id={card.id} 
                    isFaceDown={card.isFaceDown}
                    value={card.value}
                    onClick={(card) => this.handleCardClick(id, card)}/>
                <div className={ card.matched ? 'matched' : 'not-matched' }>
                    <Checkmark />
                </div>
            </div>
        )
    }  
}

Board.defaultProps = {
    totalCards: 4
}

export default Board;