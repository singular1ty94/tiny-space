import React from 'react';
import ReactDOM from 'react-dom';
const tick = 250

const upgradeLevels = [
    {
        level: 2,
        cost: 1000,
        tick: 0.5
    },
    {
        level: 3,
        cost: 4500,
        tick: 0.80
    },
    {
        level: 4,
        cost: 12000,
        tick: 1.30
    },
    {
        level: 5,
        cost: 37000,
        tick: 1.75
    }
]

const citizenGrowth = [
    {
        level: 2,
        tick: 0.1   
    },{
        level: 3,
        tick: 0.5   
    },{
        level: 4,
        tick: 1   
    },{
        level: 5,
        tick: 1.7  
    }
]

class Game extends React.Component {
    constructor(){
        super()
        this.state = {
            commodities: 1000,
            citizens: 7,
            commoditiesPerTick: 0.1,
            citizensPerTick: 0.005,
            level: 1,
            logs: []
        }

        this.getNextUpgradeCost = this.getNextUpgradeCost.bind(this)
        this.upgrade = this.upgrade.bind(this)
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                commodities: (this.state.commodities + this.state.commoditiesPerTick),
                citizens: (this.state.citizens + this.state.citizensPerTick)
            })
        }, tick)
    }

    upgrade() {
        let upgrade = this.getNextUpgradeCost()
        if (this.state.commodities >= upgrade.cost) {
            let citizenTick = citizenGrowth.filter((c) => c.level === this.state.level + 1)
            this.setState({
                commodities: this.state.commodities - upgrade.cost,
                commoditiesPerTick: upgrade.tick,
                level: upgrade.level,
                citizensPerTick: citizenTick[0].tick
            })
        } else {
            this.setState({
                logs: [...this.state.logs, 'Cannot afford the upgrade level!']
            })
        }
    }

    getNextUpgradeCost(){
        return upgradeLevels.filter((upgrade) => { return upgrade.level === (this.state.level + 1)})[0]
    }

    render() {
        const upgrade = this.getNextUpgradeCost()
        return (
            <div>
                <span><h4>Level: {this.state.level}</h4></span>
                <br/>
                <span><strong>Commodities: {Math.floor(this.state.commodities)}</strong></span>
                <br/>
                <span><strong>Citizens: {Math.floor(this.state.citizens)}</strong></span>
                <br/>
                <button onClick={this.upgrade}>{upgrade.cost}</button>
                <br />
                <div>
                    {this.state.logs.map((x, i) =>
                        <p key={i}>{x}</p>
                    )}
                </div>
            </div>
        )
    }
  }

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);