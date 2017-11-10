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
        tick: 0.4
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

const PIRATE_BASIC = {
    attack: 3,
    defense: 0,
    accuracy: 0.3
}

const pirates = [
    {
        citizens: 25,
        pirates: [
            PIRATE_BASIC
        ]
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
            logs: [],
            attacks: [],
            underAttack: null
        }

        this.getNextUpgradeCost = this.getNextUpgradeCost.bind(this)
        this.upgrade = this.upgrade.bind(this)
        this.updateGame = this.updateGame.bind(this)
    }

    componentDidMount() {
        setInterval(this.updateGame, tick)
    }

    updateGame() {
        let pirateAttack = pirates.filter((pirate) => 
            this.state.citizens >= pirate.citizens &&
            !this.state.attacks.includes(pirate)
        )
        if (pirateAttack.length > 0){
            pirateAttack = pirateAttack.sort((a, b) => b.citizens - a.citizens)[0]
            this.setState({
                logs: [...this.state.logs, 'Pirate attack!!'],
                attacks: [...this.state.attacks, pirateAttack],
                underAttack: pirateAttack
            })
        }

        if (this.state.underAttack) {
            this.state.underAttack.pirates.map((pirate) => {
                const doesHit = (Math.random() <= pirate.accuracy)
                if(doesHit) {
                    this.setState({
                        citizens: this.state.citizens - pirate.attack,
                        logs: [...this.state.logs, `${pirate.attack} citizens died!!!`]
                    })
                }
            })
        }

        this.setState({
            commodities: (this.state.commodities + this.state.commoditiesPerTick),
            citizens: (this.state.citizens + this.state.citizensPerTick)
        })
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