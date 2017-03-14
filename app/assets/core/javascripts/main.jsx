import React from 'react';
import SideMenu from './ui/sidemenu.jsx';
import PanelTreeView from './ui/PanelTreeView.jsx';
import TabPanel from './ui/TabPanel.jsx';
import * as TabActions from './actions/TabViewActions.js';
import SplitPane from 'react-split-pane';

export default class Main extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            tabs: []
        }
    }

    closeTab(tab) {
        this.setState({
            tabs: TabActions.closeTab(tab, this.state.tabs)
        });
    }

    clickTab(tab) {
        this.setState({
            tabs: TabActions.openTab(tab, this.state.tabs)
        })
    }

    onTreeDblClick(obj) {
        this.setState({
            tabs: TabActions.addTab(obj, this.state.tabs)
        })
    }

    deleteItem(id) {
        var tab = TabActions.getTabById(id, this.state.tabs);
        this.closeTab(tab);
    }

    itemRenamed(id, newname) {
        this.setState({
            tabs: TabActions.renameTab(id, newname, this.state.tabs)
        })
    }

    resizingPanel() {
        [].forEach.call(document.getElementsByClassName("iframe-wrapper"),function(iframe){
            var div = document.createElement("div");
            div.id = "iframeblocker";
            div.className = "blockiframe";
            iframe.appendChild(div);
        });
    }

    resizingPanelFinished() {
        [].forEach.call(document.getElementsByClassName("iframe-wrapper"),function(iframe){
            [].forEach.call(iframe.childNodes, function(node){
                if(node.id == "iframeblocker"){
                    iframe.removeChild(node);
                }
            })
        });
    }

    render() {
        return(
            <div>
                <SideMenu />
                <div className="splitpane-container"> 
                    <SplitPane 
                        split="vertical" 
                        onDragStarted={this.resizingPanel.bind(this)} 
                        onDragFinished={this.resizingPanelFinished.bind(this)}  
                        minSize={200} defaultSize={400}>
                        <PanelTreeView renameItem={this.itemRenamed.bind(this)} deleteItem={(id) => this.deleteItem(id)} dblclick={this.onTreeDblClick.bind(this)} />
                        <div>
                            <TabPanel clickTab={this.clickTab.bind(this)} closeTab={this.closeTab.bind(this)} tabs={this.state.tabs} />
                        </div>
                    </SplitPane>
                </div>
            </div>
        )
    }

}
