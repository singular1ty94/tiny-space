import * as React from 'react'

export class StatsUI extends React.Component {
    render() {
        return (
            <div id="topRightUI">
                <h4>Commodities</h4>
                <h5>Citizens</h5>
                <span id="commodities">{this.props.commodities}</span>
                <span id="citizens">{this.props.citizens}</span>
            </div>
        )
    }
}