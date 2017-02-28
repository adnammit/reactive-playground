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
        let values = ['⏰', '☔']
        //let values = ['⏰', '☔', '☕', '🍄']
        let cardSet = _.map(_.flatten([values, values]), (c, i) => {
            return {id: i, value: c, isFaceDown: true, matched: false}
        })
        this.state = { 
            // cards: _.shuffle(cardSet),
            cards: cardSet,
            lastFlippedCard: null,
            missedCount: 0,
            tick: 0
        }
    }

    render() {
        return(
            <div className="board">
                <div className="card-container">
                    {this.renderCards(this.state.cards)}
                </div>
                <div className="bottom-container">
                    <p>Missed <span>{ this.state.missedCount }</span></p>
                    <button onClick={ this.handleResetClick }>Reset</button>
                    <p><span>{ this.formatTick(this.props.tick) }</span></p>
                </div>
            </div>
        )
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

    handleCardClick = (index, card) => { 
        if(this.isTimerRunning()) 
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

        this.evaluateRound(lastCard, cardFlipped) 
    }

    startTimer = () => {
        this.intervalId = setInterval(() => {
            this.setState({ tick: this.state.tick + 1 })
        }, 1000)
    }

    evaluateRound = (lastCard, cardFlipped) => {
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

            this.setState({ 
                locked: false, 
                lastFlippedCard: null,
                missedCount: updatedMissedCount
            }, () => {
                if(gameOver) {
                    this.endGame()
                }
            })
        }, 500)
    }

    formatTick = () => {
        var minute = Math.floor(this.state.tick / 60)
        var second = this.state.tick % 60
        return  minute + ":" + (second < 10 ? "0" + second : second)
    }

    isTimerRunning = () => {
        return this.intervalId === undefined || this.intervalId == null
    }

    endGame = () => {
        this.stopTimer()
        var results = JSON.stringify({"missed": this.state.missedCount, "time": this.state.tick})
        console.log(results)
    }

    stopTimer = () => {
        clearInterval(this.intervalId)
        this.intervalId = null
    }

    handleResetClick = () => {
        this.stopTimer()
        _.forEach(this.state.cards, (card) => {
            card.isFaceDown = true
            card.matched = false
        })
        this.setState({
            locked: false, 
            lastFlippedCard: null,
            missedCount: 0,
            tick: 0
        })
    } 
}

Board.defaultProps = {
    totalCards: 4
}

export default Board;