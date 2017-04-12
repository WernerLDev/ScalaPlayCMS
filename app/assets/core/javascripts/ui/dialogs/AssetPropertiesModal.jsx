import React from 'react';
import * as Api from '../../api/api.js';
import Modal from './Modal.jsx';
import {TabPanel, Tab, TabsList, TabContent} from '../panels/TabPanel.jsx';
import TextInput from '../global/TextInput.jsx';
import DateInput from '../global/DateInput.jsx';

export default class PageSettingsModal extends React.Component {

    constructor(props, context) {
        super(props);
        this.state = { working: true, visible: false, asset: null };
    }

    componentDidMount() {
        
        this.props.ee.on("assetproperties", function(item){
            this.setState({ working: true, visible: true }, () => {
                this.receiveAsset(item);
            });
        }.bind(this));
    }

    receiveAsset(item) {
        this.setState({working: true}, () => {
            if(isFinite(item)) {
                Api.getAsset(item).then(asset => {
                    this.setState({working: false, asset: asset});
                });
            } else {
                this.setState({working: false, asset: item});
            }
        });
    }

    renameAsset(newasset) {
        this.setState({working: true}, () => {
            Api.renameAsset(newasset.id, newasset.name).then(x => {
                this.receiveAsset(newasset.id);
            });
        });
    }

    onClose() {
        this.setState({ asset: null, visible: false })
    }

    render() {
        if(this.state.visible == false) return null;
        if(this.state.working && this.state.page == null) return (
            <Modal title="Loading properties" onClose={this.onClose.bind(this)}>
                <div className="loading"><img src="/assets/images/rolling.svg" alt="" /> </div>
            </Modal>
        );
        let create_date = new Date(this.state.asset.created_at);
        return(
            <Modal title="Properties" onClose={this.onClose.bind(this)}>
                {this.state.working ? <div className="loading"><img src="/assets/images/rolling.svg" alt="" /> </div> : null }
                <div className={this.state.working ? "working table" : "table"}>
                    <div className="tablerow">
                        <div className="tablecol col-4">#</div>
                        <div className="tablecol col-8"> {this.state.asset.id}</div>
                    </div>
                    <div className="tablerow">
                        <div className="tablecol col-4">Name</div>
                        <div className="tablecol col-8">
                            <TextInput value={this.state.asset.name} onChange={(v) => {
                                    var newasset = this.state.asset;
                                    newasset.name = v;
                                    this.renameAsset(newasset);
                                }} />
                        </div>
                    </div>
                    <div className="tablerow">
                        <div className="tablecol col-4">Path</div>
                        <div className="tablecol col-8"> {this.state.asset.path}</div>
                    </div>
                    <div className="tablerow">
                        <div className="tablecol col-4">Mimetype</div>
                        <div className="tablecol col-8"> {this.state.asset.mimetype}</div>
                    </div>
                    <div className="tablerow">
                        <div className="tablecol col-4">Filesize</div>
                        <div className="tablecol col-8"> {(this.state.asset.filesize / 1000).toFixed(2) + " kB"}</div>
                    </div>
                    <div className="tablerow">
                        <div className="tablecol col-4">Created at</div>
                        <div className="tablecol col-8"> {create_date.toLocaleFormat()}</div>
                    </div>
                </div>

            </Modal>
        )
    }
}