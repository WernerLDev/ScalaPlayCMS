import React from 'react';
import * as Api from '../../api/api.js';
import {LargeToolBar, ToolbarItemLarge} from '../LargeToolBar.jsx';

export default class DocsViewer extends React.Component {

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
        this.props.ee.emitEvent("assetdeleted", [this.props.id, this.state.asset.mimetype]);
    }

    renderToolbar() {
        return (
            <LargeToolBar>
                <ToolbarItemLarge clicked={this.settings.bind(this)} icon="gears" label="Properties" />
                <ToolbarItemLarge clicked={this.delete.bind(this)} icon="trash" label="" classes="button-right redbtn" />
            </LargeToolBar>
        );
    }
    
    //this.state.asset.path
//<iframe src="https://docs.google.com/viewer?url=http://infolab.stanford.edu/pub/papers/google.pdf&embedded=true" style="width:600px; height:500px;" frameborder="0"></iframe>
    render() {
        if(this.state.asset == null) {
            return(<div id="wrapper">
                    {this.renderToolbar()}
                    <div className="loading"><img src="/assets/images/rolling.svg" /></div>
                </div>)
        }
        let viewerurl = "http://view.officeapps.live.com/op/view.aspx?src=";
        var iframeurl = "/uploads" + this.state.asset.path;
        if(this.state.asset.mimetype.match("officedocument")) {
            iframeurl = viewerurl + "http://www.werlang.nl/rand/ontslagbrief.docx";
        }
        return(
            <div>
                {this.renderToolbar()}
                <div className="iframe-wrapper">
                    <iframe src={iframeurl} />
                </div>
            </div>
        )
    }
}