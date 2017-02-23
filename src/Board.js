// This is heavily inspired from 
// https://github.com/jdlehman/react-memory-game/blob/master/src/components/Game.js

import React, { Component } from 'react';
import _ from 'lodash';
import Card from './Card';
import './Board.css';

class Board extends Component {
    constructor(props){
        super(props)
        let cardsValues = ['S', 'A', 'S', 'A']
        this.state = { 
            // todo: keep a collection of Card components rather than objects
            // then, you can don't need to manage all these IDs
            cards: _.map(cardsValues, (c, i) => {
                return {id: i, value: c, isFaceDown: true, matched: false}
            }),
            lastFlippedCard: null,
        }
    }

    handleCardClick = (index, card) => {   
        let cardFlipped = this.state.cards[index]
        var lastCard = this.state.lastFlippedCard

        if(!cardFlipped.isFaceDown) return

        cardFlipped.isFaceDown = false
        this.forceUpdate() // todo: hrmmm...

        if(lastCard != null) {
            let isSameCard = lastCard.id === cardFlipped.id 
            let isMatch = lastCard.value === cardFlipped.value
            let alreadyMatchedCard = lastCard.matched || cardFlipped.alreadyMatchedCard

            if(!isSameCard && !alreadyMatchedCard && isMatch) {
                console.log("MATCH!")
                this.SetMatch([cardFlipped, lastCard], true)            
            } else {
                console.log("NO MATCH!")
                this.SetMatch([cardFlipped, lastCard], false)
            } 
        } else {
            this.setLastFlippedCard(cardFlipped)
        }
    }

    SetMatch = (cards, isMatch) => {
        setTimeout(() => {
            _.forEach(cards, (card) => {
                card.isFaceDown = !isMatch
                card.matched = isMatch
            }) 
            this.setLastFlippedCard(null)
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
            <Card key={id} 
                  id={card.id} 
                  isFaceDown={card.isFaceDown}
                  value={card.value}
                  onClick={(card) => this.handleCardClick(id, card)}/>
        )
    }

    render() {
        return(
            <div className="Board">
                {this.renderCards(this.state.cards)}
                <button onClick={this.handleResetClick}>Reset</button>
            </div>
        )
    }   
}

Board.defaultProps = {
    totalCards: 4
}

export default Board;