// This is heavily inspired from 
// https://github.com/jdlehman/react-memory-game/blob/master/src/components/Game.js

import React, { Component } from 'react';
import _ from 'lodash';
import Card from './Card';
import Checkmark from './Checkmark';
import Timer from './Timer';
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
            missedCount: 0,
            isPlaying: false,
        }
    }

    render() {
        return(
            <div className="board">
                <div className="card-container">
                    {this.renderCards(this.state.cards)}
                </div>
                <div className="bottom-container">
                    <p>Missed <span>{this.state.missedCount}</span></p>
                    <button onClick={this.handleResetClick}>Reset</button>
                    <Timer isRunning={this.state.isPlaying}/>
                </div>
            </div>
        )
    } 

    startTimer = () => {
        if(!this.state.isPlaying) {
            this.setState({ isPlaying: true })
        }
    }

    handleCardClick = (index, card) => { 
        this.startTimer()

        let cardFlipped = this.state.cards[index]
        var lastCard = this.state.lastFlippedCard 

        if(this.state.locked || !cardFlipped.isFaceDown) return

        cardFlipped.isFaceDown = false

        if(lastCard == null) 
        {
            this.setState({ lastFlippedCard: cardFlipped })  
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

            var updatedMissedCount = hasMatch ? this.state.missedCount : this.state.missedCount + 1
            var gameOver = this.state.cards.every(c => c.matched)

            if(gameOver) {
                
                console.log(this.getTimer().props)
            }

            this.setState({ 
                locked: false, 
                lastFlippedCard: null,
                missedCount: updatedMissedCount,
                isPlaying: !gameOver
            })
        }, 500)
        
    }
    
    handleResetClick = () => {
        _.forEach(this.state.cards, (card) => {
            card.isFaceDown = true
            card.matched = false
        })
        this.setState({
            locked: false, 
            lastFlippedCard: null,
            missedCount: 0,
            isPlaying: false,
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