import React from 'react'
import ReactDOM from 'react-dom'
import { PIRATE_LV_1, PIRATE_LV_2, pirates } from './pirates'
import { planetsGenerator } from './planets'
import { addons } from './addons'
import { tick, upgradeLevels, citizenGrowth, defenseLevels } from './config'

class Game extends React.Component {
    constructor(){
        super()
        this.state = {
            commodities: 1000,
            citizens: 7,
            commoditiesPerTick: 0.25,
            citizensPerTick: 0.05,
            level: 1,
            logs: [],
            attacks: [],
            underAttack: null,
            defenseAttack: 1,
            defenseLevel: 1,
            defenseAccuracy: 0.25,
            planets: planetsGenerator(20),
            planetsVisited: [],
            addonsBuilt: []
        }

        this.getNextUpgradeCost = this.getNextUpgradeCost.bind(this)
        this.upgrade = this.upgrade.bind(this)
        this.upgradeDefense = this.upgradeDefense.bind(this)
        this.updateGame = this.updateGame.bind(this)
        this.checkForPlanetVisits = this.checkForPlanetVisits.bind(this)
        this.buildAddon = this.buildAddon.bind(this)
    }

    buildAddon(addon) {
        if (this.state.commodities >= addon.cost) {
            let commoditiesPerTick = this.state.commoditiesPerTick
            let defenseAccuracy = this.state.defenseAccuracy
            let citizensPerTick = this.state.citizensPerTick
            switch(addon.type) {
                case 'COMMODITY_GAIN':
                    commoditiesPerTick = this.state.commoditiesPerTick + addon.benefit 
                    break;
                case 'DEFENSE_ACCURACY':
                    defenseAccuracy = this.state.defenseAccuracy + addon.benefit 
                    break;
                case 'CITIZEN_GAIN':
                    citizensPerTick = this.state.citizensPerTick + addon.benefit 
                    break;
            }

            this.setState({
                commoditiesPerTick: commoditiesPerTick,
                citizensPerTick: citizensPerTick,
                defenseAccuracy: defenseAccuracy,
                addonsBuilt: [...this.state.addonsBuilt, addon],
                commodities: this.state.commodities - addon.cost,
                logs: [...this.state.logs, `You build the ${addon.name}!`]
            })
        } else {
            this.setState({
                logs: [...this.state.logs, `You cannot afford the ${addon.name}.`]
            })
        }
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
                commoditiesPerTick: this.state.commoditiesPerTick + upgrade.tick,
                level: upgrade.level,
                citizensPerTick: this.state.citizensPerTick + citizenTick[0].tick
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
                defenseLevel: upgradeDef.level,
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
        return defenseLevels.filter((defense) => { return defense.level === (this.state.defenseLevel + 1)})[0]
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
        const filteredAddons = addons.filter(x => !this.state.addonsBuilt.includes(x))
        return (
            <div className="container">
                <div className="row">
                    <div className="one-half column">
                        <h4>Station Level: {this.state.level}</h4>
                        <h5>Defense Level: {this.state.defenseLevel}</h5>
                        <br/>
                        <p>Commod/tk {this.state.commoditiesPerTick}</p>
                        <p>Citizen/tk {this.state.citizensPerTick}</p>
                        <p>DefAc {this.state.defenseAccuracy}</p>
                        <span><strong>Commodities: {Math.floor(this.state.commodities)}</strong></span>
                        <br/>
                        <span><strong>Citizens: {Math.floor(this.state.citizens)}</strong></span>
                        <br/>
                        {upgrade && 
                            <div>
                                <span>Upgrade Station</span> <button onClick={this.upgrade}>${upgrade.cost}</button>
                            </div>
                        }
                        <br/>
                        {upgradeDefense && 
                            <div>
                                <span>Upgrade Defense</span> <button onClick={this.upgradeDefense}>{upgradeDefense.cost} citizens</button>
                            </div>
                        }
                        <br />
                    </div>
                    <div className="one-half column">
                    <h4>Logs</h4>
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
                </div>
                <div className="row">
                    <div className="one-half column">
                        <h4>Build</h4>
                        {filteredAddons.map((x, i) =>
                            <div key={i}>
                                <span>{x.name}</span> <button title={x.description} onClick={() => this.buildAddon(x)}>{x.cost}</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
  }

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);