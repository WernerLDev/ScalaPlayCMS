import React from 'react';
import {LargeToolBar, ToolbarItemLarge} from '../LargeToolBar.jsx';
import * as Api from '../../api/api.js';

export default class TestEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = { document: null, iframeloaded: false };
    }

    componentDidMount() {
        Api.getDocument(this.props.id).then(doc => {
            this.setState({ document: doc });
        })
    }

    publish() {
        console.log("publishing");
    }

    saveItem() {
        this.setState({iframeloaded: false});
        var test = this.refs.docpage.contentDocument.getElementsByClassName("editable");
        var editables = [];
        [].forEach.call(test, function(elem){
            if(elem.nodeName != "INPUT") {
                editables.push({ id: 0, document_id: this.props.id, name: elem.id, value: elem.innerHTML });
            } else {
                editables.push({ id: 0, document_id: this.props.id, name: elem.name, value: elem.value });
            }
        }.bind(this));
        Api.SaveEditables(this.props.id, editables).then(r => {
            console.log("saved !");
            setTimeout(function() {
                this.setState({iframeloaded: true});
            }.bind(this), 500);
        })
    }

    settings() {
        console.log("Open settings");
    }

    preview() {
        console.log("Previewing");
    }

    delete() {
        console.log("Deleting");
    }

    renderToolbar() {
        return (
            <LargeToolBar>
                <ToolbarItemLarge clicked={this.publish.bind(this)} icon="life-ring" label="Publish" />
                <ToolbarItemLarge clicked={this.publish.bind(this)} icon="chevron-down" label="" />
                <ToolbarItemLarge clicked={this.saveItem.bind(this)} icon="floppy-o" label="Save" />
                <ToolbarItemLarge clicked={this.settings.bind(this)} icon="gears" label="Settings" />
                <ToolbarItemLarge clicked={this.preview.bind(this)} icon="eye" label="Preview" />
                <ToolbarItemLarge clicked={this.delete.bind(this)} icon="trash" label="" classes="button-right redbtn" />
            </LargeToolBar>
        );
    }

    render() {
        if(this.state.document == null) {
            return(<div id="wrapper">
                    {this.renderToolbar()}
                    <div className="loading"><img src="/assets/images/rolling.svg" /></div>
                </div>)
        }
        return(
            <div id="wrapper">
                {this.renderToolbar()}
                <div className="iframe-wrapper">
                    <iframe onLoad={() => this.setState({iframeloaded: true})} ref="docpage" src={this.state.document.path + "?editmode=editing"} />
                </div>
                 {this.state.iframeloaded ? null : <div className="loadingiframe"> <img src="/assets/images/rolling.svg" /> </div>}
            </div>
        )
    }
}