import * as React from 'react'
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
    }

    clickEvent(e) {
        this.meteors.forEach((m) => {
            if (e.pageX >= m.x && e.pageX <= m.x + m.image.width
               && e.pageY >= m.y && e.pageY >= m.image.height) {
                // Time to mine some ore!
                if (!m.dry) {
                    let res = resourceList.filter((r) => r.rarity == this.props.base.rarity)
                    let mine = res[getRandom(0, res.length - 1)]
                    console.log(`You got a ${mine}!`)
                    this.props.gain(mine)
                    m.dry = true
                } else {
                    console.log("The asteroid is empty!")
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
                x: getRandom(0, window.innerWidth),
                y: getRandom(0, window.innerHeight),
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
            ctx.drawImage(m.image, -m.image.width/2, -m.image.height/2)
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
            </div>
        )
    }
}