import React from 'react'
import ReactDOM from 'react-dom'
import { PIRATE_LV_1, PIRATE_LV_2, pirates } from './pirates'
import { planetsGenerator } from './planets'
import { addons } from './addons'
import { tick, upgradeLevels, citizenGrowth, defenseLevels } from './config'
import { getRandom, nebula, drawStars } from './helpers'
import { BuildMenu,
         UpgradeMenu,
         ResourceMenu,
         LevelUI,
         StatsUI
        } from './components'
import * as resource from './resources'
import { GalacticSystem } from './components/System';
import { SIREN_CLOUD } from './systems'

const FRAME_RATE = 30

class Game extends React.Component {
    canvas;
    starfield;
    degrees;
    spaceStation;
    nebula1;
    nebula2;
    nebula3;
    nebulaId;

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
            addonsBuilt: [],
            resources: [resource.ALUMINUM],
            currentSystem: SIREN_CLOUD
        }

        this.drawBackgrounds = this.drawBackgrounds.bind(this)
        this.renderStation = this.renderStation.bind(this)
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
                    break
                case 'DEFENSE_ACCURACY':
                    defenseAccuracy = this.state.defenseAccuracy + addon.benefit 
                    break
                case 'CITIZEN_GAIN':
                    citizensPerTick = this.state.citizensPerTick + addon.benefit 
                    break
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
        this.spaceStation = new Image()
        this.spaceStation.src = 'dist/resources/station/spaceStation_023.png'

        // Fetch all resources in a side-effecting manner
        addons.forEach((addon) => {
            addon.display.image = new Image()
            addon.display.image.src = addon.display.url
        })

        setInterval(this.renderStation, 1000 / FRAME_RATE)
        if (this.state.currentSystem == 'HOME') { 
            this.drawBackgrounds()
        }
    }

    drawBackgrounds() {
        drawStars(this.starfield)
        this.nebulaId = nebula(this.nebula1, this.nebula2, this.nebula3, window.innerWidth / 2, window.innerHeight / 2)
    }

    renderStation() {
        // Render
        if (this.state.currentSystem == 'HOME') {
            const ctx = this.canvas.getContext('2d')
            ctx.canvas.width  = window.innerWidth
            ctx.canvas.height = window.innerHeight

            let centerX = ctx.canvas.width / 2
            let centerY = ctx.canvas.height / 2

            ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height)

            let degrees = (this.degrees || 0) + ((360 / 7) / FRAME_RATE)
            ctx.save()
            ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2)
            ctx.rotate(degrees * Math.PI / 180)
            // ctx.drawImage(this.spaceStation, -(this.spaceStation.width / 2), -(this.spaceStation.height /2))
            ctx.drawImage(this.spaceStation, -this.spaceStation.width / 2, -this.spaceStation.height / 2)
            this.degrees = degrees
            ctx.restore()     

            // Render any addons we have
            this.state.addonsBuilt.forEach((addon) => {
                if (addon.display.orbital) {
                    if (addon.display.direction) {
                        addon.display.angle += Math.acos(1-Math.pow(addon.display.speed/addon.display.orbital,2)/2);
                    } else {
                        addon.display.angle -= Math.acos(1-Math.pow(addon.display.speed/addon.display.orbital,2)/2);
                    }
                    
                    // calculate the new ball.x / ball.y
                    var newX = (centerX) + addon.display.orbital * Math.cos(addon.display.angle);
                    var newY = (centerY) + addon.display.orbital * Math.sin(addon.display.angle);

                    // Draw an orbital trail
                    ctx.strokeStyle = "lightgray";
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, addon.display.orbital, 0, Math.PI * 2, false);
                    ctx.closePath();
                    ctx.stroke();
        
                    // draw
                    ctx.drawImage(addon.display.image, newX - (addon.display.image.width / 2), newY - (addon.display.image.height / 2))  
                } else {
                    ctx.drawImage(addon.display.image, centerX - (addon.display.image.width / 2), centerY - (addon.display.image.height / 2))  
                }           
            })
        }
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
        const upgradeStation = this.getNextUpgradeCost()
        const upgradeDefense = this.getNextDraftCost()
        const filteredAddons = addons.filter(x => !this.state.addonsBuilt.includes(x))
        return (
            <div>
                {this.state.currentSystem == 'HOME' &&
                    <div>
                        <canvas
                            ref={(starfield) => { this.starfield = starfield; }}
                            width="100%"
                            height="100%" 
                            style={{position: "absolute", left: 0, top: 0, zIndex: 0}}>
                        </canvas>

                        <canvas ref={(nebula1) => {this.nebula1 = nebula1; }} 
                                style={{display:"none"}} id="canvas" width={window.innerWidth /2} height={window.innerHeight /2}></canvas>
                        <canvas  ref={(nebula3) => {this.nebula3 = nebula3; }} 
                                style={{display:"none"}} id="canvas3" width={window.innerWidth} height={window.innerHeight}></canvas>
                        <canvas  ref={(nebula2) => {this.nebula2 = nebula2; }} 
                                id="canvas2" width={window.innerWidth} height={window.innerHeight}></canvas>

                        <canvas
                            ref={(canvas) => { this.canvas = canvas }}
                            width="100%"
                            height="100%" 
                            style={{position: "absolute", left: 0, top: 0, zIndex: 2}}>
                        </canvas>

                        <div style={{position: "absolute", left: 0, top: 0, zIndex: 3, width: "100%", height: "100%"}}>
                            <div className="row">
                                <LevelUI
                                    stationLevel={this.state.level}
                                    defenseLevel={this.state.defenseLevel} 
                                />
                                <StatsUI
                                    commodities={Math.floor(this.state.commodities)}
                                    citizens={Math.floor(this.state.citizens)}
                                />

                                <div id="topMidUI">
                                    <button onClick={() => {
                                        this.setState({
                                            systemTravel: !(this.state.systemTravel || false)
                                        })
                                    }}>Galactic Map</button>
                                    <div id="slideoutTravel" className={this.state.systemTravel ? 'on': null} >
                                        <h4 onClick={() => {
                                            this.setState({
                                                systemTravel: !(this.state.systemTravel || false)
                                            })
                                        }}>Galactic Map</h4>
                                        <div className="buildButtons">
                                            <span>Siren Cloud</span><br />
                                            <button className="button-primary"
                                                    onClick={() => {
                                                        clearTimeout(this.nebulaId)
                                                        this.setState({ systemTravel: false, currentSystem: SIREN_CLOUD})
                                                    }}>Visit</button>
                                        </div>
                                    </div>
                                </div>

                            <div className="row">
                                <BuildMenu 
                                    active={this.state.buildMenuActive || false}
                                    addons={filteredAddons}
                                    build={(addon) => this.buildAddon(addon)}
                                    toggleMenu={() => {
                                        this.setState({
                                            buildMenuActive: !(this.state.buildMenuActive || false)
                                        })
                                    }} 
                                />
                                <UpgradeMenu
                                    active={this.state.upgradeMenuActive || false}
                                    toggleMenu={() => {
                                        this.setState({
                                            upgradeMenuActive: !(this.state.upgradeMenuActive || false)
                                        })
                                    }}
                                    upgradeStation={() => this.upgrade()}
                                    upgradeDefense={() => this.upgradeDefense()}
                                    upgradeStationData={upgradeStation}
                                    upgradeDefenseData={upgradeDefense}
                                />

                                <ResourceMenu 
                                    active={this.state.resourceMenuActive || false}
                                    resources={this.state.resources}
                                    toggleMenu={() => {
                                        this.setState({
                                            resourceMenuActive: !(this.state.resourceMenuActive || false)
                                        })
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                    </div>
                }
                { this.state.currentSystem !== 'HOME' &&
                    <GalacticSystem
                        base={this.state.currentSystem}
                        returnHome={() => this.setState({ currentSystem: 'HOME' }, () => this.drawBackgrounds())}
                        gain={(resource) => {
                            let resources = this.state.resources
                            if (resources.includes(resource)) {
                                resource.held = resource.held + 1
                            } else {
                                resource.held = 1
                                resources.push(resource)
                            }
                            this.setState({
                                resources: resources
                            })
                        }}
                    />
                }
            </div>
        )
    }
  }

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)

/* 
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
                        </div> 
                                                    <br/>
                            <p>Commod/tk {this.state.commoditiesPerTick}</p>
                            <p>Citizen/tk {this.state.citizensPerTick}</p>
                            <p>DefAc {this.state.defenseAccuracy}</p>
*/