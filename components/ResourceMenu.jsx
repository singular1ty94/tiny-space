import * as React from 'react'
import { resourceList } from '../resources'

export class ResourceMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            offset: 0
        }
    }
    render() {
        let resourcesNotCollected = resourceList.filter((res) => !this.props.resources.includes(res))
        let allResources = [].concat(this.props.resources, resourcesNotCollected)
        return (
            <div id="bottomRightUI">
                <button onClick={() => this.props.toggleMenu()}>Resources</button>
                <div id="slideoutResources" className={this.props.active ? 'on': null} >
                    <h4 onClick={() => this.props.toggleMenu()}>Resources</h4>
                    {allResources.slice(this.state.offset, this.state.offset + 6).map((x, i) => {
                        if(this.props.resources.includes(x)) {
                            return (
                                <div className="resourceSquare" key={i}>
                                    <span>{x.name} ({x.held})</span><br />
                                    <button className="button-primary" title="Sell">Sell: {x.resale}</button>
                                </div>
                            )
                        } else {
                            return (
                                <div className="resourceSquare" key={i}>
                                    <span>?</span>
                                </div>
                            )
                        }
                    })}
                    <div className="resources-controls">
                        <span
                            onClick={() => this.state.offset > 0 && this.setState({ offset: this.state.offset - 6})}
                        >&lt;&lt; Prev Page</span>
                        <span onClick={() => this.setState({ offset: this.state.offset + 6})}>Next Page &gt;&gt;</span>
                    </div>
                </div>
            </div>
        )
    }
}