import React from 'react';
import * as Api from '../../api/api.js';
import {LargeToolBar, ToolbarItemLarge} from '../LargeToolBar.jsx';

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

    settings() {

    }

    delete() {
        this.props.ee.emitEvent("assetdeleted", [this.props.id, this.state.asset.mimetype]);
    }

    renderToolbar() {
        return (
            <LargeToolBar>
                <ToolbarItemLarge clicked={this.delete.bind(this)} icon="trash" label="" classes="button-right redbtn" />
            </LargeToolBar>
        );
    }
    
    //this.state.asset.path
    render() {
        let viewerurl = "http://view.officeapps.live.com/op/view.aspx?src=";
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