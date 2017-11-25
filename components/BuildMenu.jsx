import * as React from 'react'

export class BuildMenu extends React.Component {
    render() {
        return (
            <div id="bottomLeftUI">
                <button onClick={() => this.props.toggleMenu()}>Build</button>
                <div id="slideout" className={this.props.active ? 'on': null} >
                    <h4 onClick={() => this.props.toggleMenu()}>Build</h4>
                    {this.props.addons.map((x, i) =>
                        <div className="buildButtons" key={i}>
                            <span>{x.name}</span><br />
                            <button className="button-primary"
                                title={x.description} onClick={() => this.props.build(x)}>{x.cost}</button>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}