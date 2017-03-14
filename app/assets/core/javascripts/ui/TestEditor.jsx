
import React from 'react';
import {LargeToolBar, ToolbarItemLarge} from './LargeToolBar.jsx';
import SplitPane from 'react-split-pane';
import * as Api from '../api/api.js';

export default class TestEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = { document: null };
    }

    componentDidMount() {
        Api.getDocument(this.props.docid).then(doc => {
            this.setState({ document: doc, iframeloaded: false });
        })
    }

    publish() {
        console.log("publishing");
    }

    saveItem() {
        console.log("CLicked save");
        var test = this.refs.docpage.contentDocument.getElementsByClassName("editable");
        var editables = [];
        [].forEach.call(test, function(elem){
            if(elem.nodeName != "INPUT") {
                editables.push({ id: 0, document_id: this.props.docid, name: elem.id, value: elem.innerHTML });
            } else {
                editables.push({ id: 0, document_id: this.props.docid, name: elem.name, value: elem.value });
            }
        }.bind(this));
        Api.SaveEditables(this.props.docid, editables).then(r => {
            console.log("saved !");
        })
        console.log(editables);
        console.log(test);
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
                    <div className="loading"><img src="/assets/images/ring.svg" /></div>
                </div>)
        }
        return(
            <div id="wrapper">
                {this.renderToolbar()}
                <div className="iframe-wrapper">
                    <iframe onLoad={() => this.setState({document: this.state.document, iframeloaded: true})} ref="docpage" src={this.state.document.path + "?editmode=editing"} />
                </div>
                 {this.state.iframeloaded ? null : <div className="loadingiframe"> <img src="/assets/images/ring.svg" /> </div>}
            </div>
        )
    }
}