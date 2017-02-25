import React, { Component, PropTypes } from 'react';

export default class Timer extends Component {
    constructor(props){
        super(props)
        this.state = { 
            tick: 0,
            isRunning: false
         }
    }

    render() {
        return(
            <p><span>{ this.formatTick() }</span></p>
        )
    } 

    formatTick = () =>{
        var minute = Math.floor(this.state.tick / 60)
        var second = this.state.tick % 60
        return  minute + ":" + (second < 10 ? "0" + second : second)
    }

    componentWillReceiveProps(nextProps) {
        var willRun = nextProps.isRunning

        if(this.intervalId === undefined && willRun) {
            this.setState({ isRunning: true})
            this.intervalId = setInterval(() => {
                this.setState({ tick: this.state.tick + 1 })
            }, 1000)
        }

        if(this.state.isRunning && !willRun) {
            clearInterval(this.intervalId)
            this.setState({ 
                tick: this.state.tick, 
                isRunning: false 
            })
            this.intervalId = undefined
        }

        if(!this.state.isRunning && !willRun) {
            this.setState({ 
                tick: 0, 
            })
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }
}

Timer.propTypes = {
    isRunning: PropTypes.bool,
}