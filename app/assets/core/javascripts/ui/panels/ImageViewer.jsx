
import React from 'react';
import * as Api from '../../api/api.js';
import {LargeToolBar, ToolbarItemLarge} from '../LargeToolBar.jsx';

export default class ImageViewer extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { asset: null };
    }

    componentDidMount() {
        Api.getAsset(this.props.id).then(asset => {
            this.setState({asset: asset})
        })
    }

    settings() {

    }

    delete() {

    }

    renderToolbar() {
        return (
            <LargeToolBar>
                <ToolbarItemLarge clicked={this.settings.bind(this)} icon="gears" label="Properties" />
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
            <div className="imageviewerback">
                {this.renderToolbar()}
                <div className="imageviewer">
                  <img src={"/uploads/" + this.state.asset.name} />
                </div>
            </div>
        )
    }
}