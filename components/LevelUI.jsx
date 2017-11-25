import * as React from 'react'

export class LevelUI extends React.Component {
    render() {
        return (<div id="topLeftUI">
            <h4>Station</h4>
            <h5>Defense</h5>
            <span id="stationLevel">Lv {this.props.stationLevel}</span>
            <span id="defenseLevel">Lv {this.props.defenseLevel}</span>
        </div>)
    }
}