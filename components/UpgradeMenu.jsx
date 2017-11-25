import * as React from 'react'

export class UpgradeMenu extends React.Component {
    render() {
        return (
            <div id="bottomMidUI">
                <button onClick={() => this.props.toggleMenu()}>Upgrade</button>
                <div id="slideoutUpgrade" className={this.props.active ? 'on' : null} >
                    <h4 onClick={() => this.props.toggleMenu()}>Upgrade</h4>
                    {this.props.upgradeStationData &&
                        <div className="buildButtons">
                            <span>Upgrade Station</span><br />
                            <button
                            className="button-primary"
                            onClick={() => this.props.upgradeStation()}>{this.props.upgradeStationData.cost}</button>
                        </div>
                    }
                    <br />
                    {this.props.upgradeDefenseData &&
                        <div className="buildButtons">
                            <span>Upgrade Defense</span><br />
                            <button
                            className="button-primary"
                            onClick={() => this.props.upgradeDefense()}>{this.props.upgradeDefenseData.cost}</button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}