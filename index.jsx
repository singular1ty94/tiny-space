import React from 'react'
import ReactDOM from 'react-dom'
import { PIRATE_LV_1, PIRATE_LV_2, pirates } from './pirates'
import { planetsGenerator } from './planets'

const tick = 250

const upgradeLevels = [
    {
        level: 2,
        cost: 500,
        tick: 0.5
    },
    {
        level: 3,
        cost: 1500,
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
        tick: 0.6   
    },{
        level: 4,
        tick: 1.1   
    },{
        level: 5,
        tick: 1.7  
    }
]

const defenceLevels = [
    {
        level: 2,
        accuracy: 0.4,
        attack: 3,
        cost: 15
    },{
        level: 3,
        accuracy: 0.7,
        attack: 6,
        cost: 50
    }
]

class Game extends React.Component {
    constructor(){
        super()
        this.state = {
            commodities: 1000,
            citizens: 7,
            commoditiesPerTick: 0.25,
            citizensPerTick: 0.005,
            level: 1,
            logs: [],
            attacks: [],
            underAttack: null,
            defenseAttack: 1,
            defenseAccuracy: 0.25,
            planets: planetsGenerator(20),
            planetsVisited: []
        }

        this.getNextUpgradeCost = this.getNextUpgradeCost.bind(this)
        this.upgrade = this.upgrade.bind(this)
        this.upgradeDefense = this.upgradeDefense.bind(this)
        this.updateGame = this.updateGame.bind(this)
        this.checkForPlanetVisits = this.checkForPlanetVisits.bind(this)
    }

    checkForPlanetVisits() {
        return this.state.planets.filter((planet) => 
            !this.state.planetsVisited.includes(planet) &&
            this.state.commodities >= planet.threshold
        )
    }

    componentDidMount() {
        setInterval(this.updateGame, tick)
    }

    updateGame() {
        let pirateAttack = pirates.filter((pirate) => 
            this.state.citizens >= pirate.citizens &&
            !this.state.attacks.includes(pirate) &&
            !this.state.underAttack
        )
        if (pirateAttack.length > 0){
            pirateAttack = pirateAttack.sort((a, b) => b.citizens - a.citizens)[0]
            this.setState({
                logs: [...this.state.logs, 'Pirate attack!!'],
                attacks: [...this.state.attacks, pirateAttack],
                underAttack: pirateAttack.pirates
            })
        }

        if (this.state.underAttack) {
            this.state.underAttack.map((pirate, index) => {
                const doesHit = (Math.random() <= pirate.accuracy)
                if(doesHit) {
                    this.setState({
                        citizens: this.state.citizens - pirate.attack,
                        logs: [...this.state.logs, `${pirate.attack} citizens died!!!`]
                    })
                }

                const fightBack = (Math.random() <= this.state.defenseAccuracy)
                if(fightBack) {
                    let pirateShip = {...pirate}
                    pirateShip.defense -= this.state.defenseAttack

                    let newPiratesArray = [...this.state.underAttack]

                    if (pirateShip.defense <= 0) {
                        newPiratesArray.splice(index, index + 1)
                        this.setState({
                            underAttack: newPiratesArray.length > 0 ? newPiratesArray : null,
                            logs: [...this.state.logs, `Pirate ship was destroyed!!`]
                        })
                    } else {
                        newPiratesArray[index] = pirateShip
                        this.setState({
                            underAttack: newPiratesArray,
                            logs: [...this.state.logs, 'Contact made with enemy ship!']
                        })
                    }
                }
            })
        }

        this.setState({
            planetsVisited: [...this.state.planetsVisited, ...this.checkForPlanetVisits()],
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

    upgradeDefense() {
        let upgradeDef = this.getNextDraftCost()
        if (this.state.citizens >= upgradeDef.cost) {
            this.setState({
                citizens: this.state.citizens - upgradeDef.cost,
                defenseAttack: upgradeDef.attack,
                defenseAccuracy: upgradeDef.accuracy
            })
        } else {
            this.setState({
                logs: [...this.state.logs, 'Cannot afford to draft that many citizens!']
            })
        }
    }
 
    getNextUpgradeCost(){
        return upgradeLevels.filter((upgrade) => { return upgrade.level === (this.state.level + 1)})[0]
    }

    getNextDraftCost(){
        return defenceLevels.filter((defense) => { return defense.level === (this.state.level + 1)})[0]
    }

    componentDidUpdate() {
        if (this.state.logs.length >= 5) {
            this.setState({
                logs: this.state.logs.reverse().slice(0, 4).reverse()
            })
        }
    }

    render() {
        const upgrade = this.getNextUpgradeCost()
        const upgradeDefense = this.getNextDraftCost()
        return (
            <div>
                <span><h4>Level: {this.state.level}</h4></span>
                <br/>
                <span><strong>Commodities: {Math.floor(this.state.commodities)}</strong></span>
                <br/>
                <span><strong>Citizens: {Math.floor(this.state.citizens)}</strong></span>
                <br/>
                <span>Upgrade Station</span><button onClick={this.upgrade}>${upgrade.cost}</button>
                <br/>
                <span>Upgrade Defense</span><button onClick={this.upgradeDefense}>{upgradeDefense.cost} citizens</button>
                <br />
                <div>
                    {this.state.logs.map((x, i) =>
                        <p key={i}>{x}</p>
                    )}
                </div>
                <br />
                <br />
                <h4>Planets Visited</h4>
                {this.state.planetsVisited && this.state.planetsVisited.map((x, i) =>
                    <p key={i}>{x.name} - arrived! They have {x.population} citizens.</p>
                )}
                <br />
                <br />
                <h4>Potential Planets</h4>
                {this.state.planets.map((x, i) =>
                    <p key={i}>{x.name} - arrives at {x.threshold}</p>
                )}
            </div>
        )
    }
  }

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);