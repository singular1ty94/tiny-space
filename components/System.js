import * as React from 'react'
import ReactDOM from 'react-dom'
import { getRandom, drawStars, nebula } from '../helpers'
import { resourceList, TYPE, RARITY } from '../resources'

const METEOR_IMAGES = ['spaceMeteors_001.png', 'spaceMeteors_002.png', 'spaceMeteors_003.png', 'spaceMeteors_004.png']

export class GalacticSystem extends React.Component {
    canvas;
    _frameId;
    meteors;
    starfield;
    nebula1;
    nebula2;
    nebula3;
    nebulaId;

    constructor(props) {
        super(props)

        this.loop = this.loop.bind(this)
        this.clickEvent = this.clickEvent.bind(this)
        this.popup = this.popup.bind(this)

        this.state = {
            rewardPop: false,
            rewardPopStyle: {},
            rewardPopText: ''
        }
    }

    popup(text, x, y) {
        this.setState({ 
            rewardPop: true,
            rewardPopStyle: {
                left: x,
                top: y
            },
            rewardPopText: text
         })
    }

    clickEvent(e) {
        let coords = this.canvas.relMouseCoords(e)
        this.meteors.forEach((m) => {
            if (coords.x >= m.x -(m.image.width/2) && coords.x <= m.x + (m.image.width /2)
             && coords.y >= m.y - (m.image.height/2) && coords.y <= m.y + (m.image.height /2)) {
                // Time to mine some ore!
                if (!m.dry) {
                    let res = resourceList.filter((r) => r.rarity == this.props.base.rarity && r.type == TYPE.METAL)
                    let mine = res[getRandom(0, res.length - 1)]
                    this.popup(`You extracted ${mine.name}!`, coords.x, coords.y)
                    this.props.gain(mine)
                    m.dry = true
                } else {
                    this.popup(`The asteroid is empty...`, coords.x, coords.y)
                }
            }
        })
    }

    componentDidMount() {
        // Spawn some meteors
        let numMeteors = getRandom(this.props.base.mining[0], this.props.base.mining[1])
        this.meteors = []
        for (var i = 0; i < numMeteors; i++) {
            let meteor = new Image()
            meteor.src = `dist/resources/meteors/${METEOR_IMAGES[getRandom(0, METEOR_IMAGES.length - 1)]}`
            this.meteors[i] = {
                image: meteor,
                x: getRandom(30, window.innerWidth - 30),
                y: getRandom(30, window.innerHeight - 30),
                degrees: 0,
                dry: false
            }
        }
        drawStars(this.starfield)
        if (this.props.base.nebula) { 
            this.nebulaId = nebula(this.nebula1, this.nebula2, this.nebula3, window.innerWidth / 2, window.innerHeight / 2)
        }
        this.startLoop()
    }
    
    componentWillUnmount() {
        clearTimeout(this.nebulaId)
        this.stopLoop()
    }
    
    startLoop() {
        if( !this._frameId ) {
            this._frameId = window.requestAnimationFrame(this.loop)
        }
    }
    
    loop() {
        // perform loop work here
        let ctx = this.canvas.getContext('2d')
        ctx.canvas.width = window.innerWidth
        ctx.canvas.height = window.innerHeight

        this.meteors.forEach((m) => { 
            let degrees = (m.degrees || 0) + ((360 / 12) / 30)
            ctx.save()
            ctx.translate(m.x, m.y)
            ctx.rotate(degrees * Math.PI / 180)
            ctx.drawImage(m.image, -(m.image.width)/2, -(m.image.height)/2)
            m.degrees = degrees
            ctx.restore()    
        })        
        // Set up next iteration of the loop
        this._frameId = window.requestAnimationFrame(this.loop)
    }
    
    stopLoop() {
        window.cancelAnimationFrame( this._frameId )
    }
    render() {
        return (
            <div>
                <canvas
                    ref={(starfield) => { this.starfield = starfield }}
                    width="100%"
                    height="100%" 
                    style={{position: "absolute", left: 0, top: 0, zIndex: 0}}>
                </canvas>

                <canvas ref={(nebula1) => {this.nebula1 = nebula1 }} 
                        style={{display:"none"}} id="canvas" width={window.innerWidth /2} height={window.innerHeight /2}></canvas>
                <canvas  ref={(nebula3) => {this.nebula3 = nebula3 }} 
                        style={{display:"none"}} id="canvas3" width={window.innerWidth} height={window.innerHeight}></canvas>
                <canvas  ref={(nebula2) => {this.nebula2 = nebula2 }} 
                        id="canvas2" width={window.innerWidth} height={window.innerHeight}></canvas>

                <div style={{position: "absolute", left: 0, top: 0, zIndex: 3, width: "100%", height: "30px"}}>
                    <div id="topMidUI">
                        <button onClick={() => this.props.returnHome()}>Return Home</button>
                    </div>
                </div>

                <canvas
                    ref={(canvas) => { this.canvas = canvas }}
                    width="100%"
                    height="100%" 
                    style={{position: "absolute", left: 0, top: 0, zIndex: 1}}
                    onClick={this.clickEvent}>
                </canvas>

                <div
                    id="reward"
                    className={this.state.rewardPop ? 'on': null}
                    style={this.state.rewardPopStyle}>
                    <p>{this.state.rewardPopText}</p>
                </div>
            </div>
        )
    }
}

function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;