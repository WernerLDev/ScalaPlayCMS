import React from 'react';
import * as Api from '../../api/api.js';
import {LargeToolBar, ToolbarItemLarge} from '../toolbars/LargeToolBar.jsx';

export default class TextViewer extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { asset: null, textcontent: "" };
    }

    componentDidMount() {
        Api.getAsset(this.props.id).then(asset => {
            fetch("/uploads" + asset.path).then(r => r.text()).then( r => {
                this.setState({asset: asset, textcontent: r})
            })
        })
    }

    properties() {
        this.props.ee.emitEvent("assetproperties", [this.state.asset]);
    }

    delete() {
        this.props.ee.emitEvent("assetdeleted", [this.props.id, this.state.asset.mimetype]);
    }

    renderToolbar() {
        return (
            <LargeToolBar>
                <ToolbarItemLarge clicked={this.properties.bind(this)} icon="gears" label="Properties" />
                <ToolbarItemLarge clicked={this.delete.bind(this)} icon="trash" label="" classes="button-right redbtn" />
            </LargeToolBar>
        );
    }
    
    render() {
        if(this.state.asset == null) {
            return(<div id="wrapper">
                    {this.renderToolbar()}
                    <div className="loading"><img src="/assets/images/rolling.svg" /></div>
                </div>)
        }
        return(
            <div>
                {this.renderToolbar()}
                <div className="textcontent">
                    {this.state.textcontent}
                </div>
            </div>
        )
    }
}