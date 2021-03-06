
import React from 'react';
import * as Api from '../../api/api.js';
import Modal from '../dialogs/Modal.jsx';
import {TabPanel, Tab, TabsList, TabContent} from '../uielements/TabPanel.jsx';
import TextInput from '../uielements/inputs/TextInput.jsx';
import DateInput from '../uielements/inputs/DateInput.jsx';
import moment from 'moment';

export default class PageSettingsModal extends React.Component {

    constructor(props, context) {
        super(props);
        this.state = { working: true, visible: false, page: null, pagetypes: [] };
    }

    componentDidMount() {
        this.props.ee.on("pageproperties", function(item){
            this.setState({ working: true, visible: true }, () => {
                Api.getPageTypes().then(result => {
                    this.receivePage(item, result.pagetypes);
                })
            });
        }.bind(this));
    }

    receivePage(item, types) {
        this.setState({working: true}, () => {
            if(isFinite(item)) {
                Api.getDocument(item).then(page => {
                    this.setState({working: false, page: page, pagetypes: types});
                });
            } else {
                this.setState({working: false, page: item, pagetypes: types});
            }
        });
    }

    renamePage(newpage) {
        this.setState({working: true}, () => {
            Api.renameDocument(newpage.id, newpage.name).then(x => {
                this.receivePage(newpage.id, this.state.pagetypes);
            });
        });
    }

    updatePage(newpage) {
        this.setState({working: true}, () => {
            Api.updateDocument(newpage).then(x => {
                this.receivePage(newpage, this.state.pagetypes);
            });
        });
    }

    onClose() {
        this.setState({visible: false, page: null});
    }

    render() {
        if(this.state.visible == false) return null;
        if(this.state.working && this.state.page == null) return (
            <Modal title="Loading properties" onClose={this.onClose.bind(this)}>
                <div className="loading"><img src="/assets/images/rolling.svg" alt="" /> </div>
            </Modal>
        );
        let create_date = moment(new Date(this.state.page.created_at)).format("MMMM Do YYYY, HH:MM");
        let update_date = moment(new Date(this.state.page.updated_at)).format("MMMM Do YYYY, HH:MM");
        let publish_date = new Date(this.state.page.published_at);
        
        return (
            <Modal title="Properties" onClose={this.onClose.bind(this)}>
                {this.state.working ? <div className="loading"><img src="/assets/images/rolling.svg" alt="" /> </div> : null }
                <div className={this.state.working ? "working table" : "table"}>
                    <div className="tablerow">
                        <div className="tablecol col-4">#</div>
                        <div className="tablecol col-8"> {this.state.page.id}</div>
                    </div>
                     <div className="tablerow">
                        <div className="tablecol col-4">Path</div>
                        <div className="tablecol col-8"> {this.state.page.path}</div>
                    </div>
                    <div className="tablerow">
                        <div className="tablecol col-4">Name</div>
                        <div className="tablecol col-8">
                            <TextInput value={this.state.page.name} onChange={(v) => {
                                    var newpage = this.state.page;
                                    newpage.name = v;
                                    this.renamePage(newpage);
                                }} />
                        </div>
                    </div>
                    <div className="tablerow">
                        <div className="tablecol col-4">Title</div>
                        <div className="tablecol col-8">
                            <TextInput value={this.state.page.title} onChange={(v) => {
                                    var newpage = this.state.page;
                                    newpage.title = v;
                                    this.updatePage(newpage);
                                }} />
                        </div>
                    </div>
                    <div className="tablerow">
                        <div className="tablecol col-4">Description</div>
                        <div className="tablecol col-8">
                            <TextInput value={this.state.page.description} onChange={(v) => {
                                    var newpage = this.state.page;
                                    newpage.description = v;
                                    this.updatePage(newpage);
                                }} />
                        </div>
                    </div>
                    <div className="tablerow">
                        <div className="tablecol col-4">Language</div>
                        <div className="tablecol col-8">
                            <select defaultValue={this.state.page.locale} onChange={(e) => {
                                    var newpage = this.state.page;
                                    newpage.locale = e.currentTarget.value;
                                    this.updatePage(newpage);
                                }}>
                                <option value="en">English</option>
                                <option value="nl">Dutch</option>
                            </select>
                            <i className="fa fa-pencil selecticon" aria-hidden="true"></i>
                        </div>
                    </div>
                   
                    <div className="tablerow">
                        <div className="tablecol col-4">Page type</div>
                        <div className="tablecol col-8"> 
                            <select onChange={(e) => {
                                    var newpage = this.state.page;
                                    newpage.view = e.currentTarget.value;
                                    this.updatePage(newpage);
                                }} defaultValue={this.state.page.view}>
                                {this.state.pagetypes.map(x => <option key={x.typekey} value={x.typekey}>{x.typename}</option>)}
                            </select>    
                            <i className="fa fa-pencil selecticon" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div className="tablerow">
                        <div className="tablecol col-4">Publish date</div>
                        <div className="tablecol col-8"> 
                            <DateInput onChange={(date) => {
                                    var newpage = this.state.page;
                                    newpage.published_at = date.getTime();
                                    this.updatePage(newpage); 
                                }} value={publish_date} />
                        </div>
                    </div>
                    <div className="tablerow">
                        <div className="tablecol col-4">Created at</div>
                        <div className="tablecol col-8"> {create_date}</div>
                    </div>
                    <div className="tablerow">
                        <div className="tablecol col-4">Last updated at</div>
                        <div className="tablecol col-8"> {update_date}</div>
                    </div>
                </div>
            </Modal>
        )
    }
}

/*
<TabsList active={this.state.activeTab} closable={false}  onClick={this.switchTab.bind(this)}>
                     <Tab id={1} label={"System"} type={"empty"} />
                     <Tab id={2} label={"Users"} type={"empty"} />
                     <Tab id={3} label={"Website"} type={"empty"} />
                </TabsList>

                <TabContent active={this.state.activeTab == 1}>
                    Settings thing {this.state.page.id}
                    bla
                </TabContent>
                <TabContent active={this.state.activeTab == 2}>
                    blaasdfasdf
                </TabContent>
                <TabContent active={this.state.activeTab == 3}>
                    blasdf
                </TabContent>
                */