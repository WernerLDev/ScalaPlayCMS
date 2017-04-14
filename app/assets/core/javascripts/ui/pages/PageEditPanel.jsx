import React from 'react';
import {LargeToolBar, ToolbarItemLarge} from '../toolbars/LargeToolBar.jsx';
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

    refreshPage() {
         var oldPath = this.state.document.path;
         this.setState({iframeloaded: false});
         Api.getDocument(this.props.id).then(doc => {
            this.setState({ document: doc }, () => {
                if(doc.path == oldPath) {
                    this.refs.docpage.contentWindow.location.reload(true);
                }
            });
        })
    }

    publish() {
        var newPublishDate = new Date();
        if(this.state.document.published_at < newPublishDate.getTime()) {
            newPublishDate = new Date(3000,1,1);
        }
        this.setState({iframeloaded: false});
        Api.updateDocumentPublishDate(this.props.id, newPublishDate.getTime()).then(x => {
            Api.getDocument(this.props.id).then(doc => {
                this.setState({ document: doc, iframeloaded: true }, () => {
                    this.props.ee.emitEvent("pagePublishDateSet", [this.props.id]);
                });
            })
        });
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

    openProperties() {
        this.props.ee.emitEvent("pageproperties", [this.state.document]);
    }

    onDelete() {
        this.props.ee.emitEvent("pagedeleted", [this.props.id]);
    }

    

    renderToolbar() {
        var publishlabel = "Publish";
        if(this.state.document != null && this.state.document.published_at < (new Date()).getTime()) {
            publishlabel = "Unpublish";
        }
        return (
            <LargeToolBar>
                <ToolbarItemLarge clicked={this.publish.bind(this)} icon="life-ring" label={publishlabel} />
                {false ? <ToolbarItemLarge clicked={this.publish.bind(this)} icon="chevron-down" label="" /> : null }
                <ToolbarItemLarge clicked={this.saveItem.bind(this)} icon="floppy-o" label="Save" />
                <ToolbarItemLarge clicked={this.openProperties.bind(this)} icon="gears" label="Properties" />
                <ToolbarItemLarge clicked={this.refreshPage.bind(this)} icon="refresh" label="Refresh" />
                <ToolbarItemLarge clicked={this.onDelete.bind(this)} icon="trash" label="" classes="button-right redbtn" />
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

                 //{this.state.showSettings ? <PageSettingsModal visible  : null }