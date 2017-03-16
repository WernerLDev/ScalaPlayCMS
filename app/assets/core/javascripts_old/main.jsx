import React from 'react';
import {SideMenu, SideMenuItem} from './ui/sidemenu.jsx';
import PanelTreeView from './ui/PanelTreeView.jsx';
import TabPanel from './ui/TabPanel.jsx';
import * as TabActions from './actions/TabViewActions.js';
import SplitPane from 'react-split-pane';
import AssetsTreeView from './ui/AssetsTreeView.jsx';

export default class Main extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            tabs: [], active: "pages"
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

    pageClicked() {
        var newActive = this.state.active == "pages" ? "" : "pages";
        var display = newActive == "" ? "none" : "block";
        this.refs.panelscontainer.parentNode.style.display = display;
        
        this.refs.pagetreeview.style.display = "block";
        this.refs.assetstreeview.style.display = "none";

        this.setState({ tabs: this.state.tabs, active: newActive });
    }

    assetsClicked() {
        var newActive = this.state.active == "assets" ? "" : "assets";
        var display = newActive == "" ? "none" : "block";
        this.refs.panelscontainer.parentNode.style.display = display;
        
        this.refs.pagetreeview.style.display = "none";
        this.refs.assetstreeview.style.display = "block";
        
        this.setState({ tabs: this.state.tabs, active: newActive });
    }

    renderPageTree() {
        return(
            <div ref="pagetreeview">
             <PanelTreeView renameItem={this.itemRenamed.bind(this)} deleteItem={(id) => this.deleteItem(id)} dblclick={this.onTreeDblClick.bind(this)} />
             </div>
        )
    }

//<PanelTreeView renameItem={this.itemRenamed.bind(this)} deleteItem={(id) => this.deleteItem(id)} dblclick={this.onTreeDblClick.bind(this)} />
    render() {
        return(
            <div>
                <SideMenu>
                    <SideMenuItem active={false} icon="home" onClick={() => console.log("clicked")} >DashBoard</SideMenuItem>
                    <SideMenuItem active={this.state.active == "pages"} icon="files-o" onClick={this.pageClicked.bind(this)} >Pages</SideMenuItem>
                    <SideMenuItem active={false} icon="cubes" onClick={() => console.log("clicked")} >Entities</SideMenuItem>
                    <SideMenuItem active={this.state.active == "assets"} icon="picture-o" onClick={this.assetsClicked.bind(this)} >Assets</SideMenuItem>
                    <SideMenuItem active={false} icon="gears" onClick={() => console.log("clicked")} >Settings</SideMenuItem>
                </SideMenu>
                <div className="splitpane-container"> 
                    <SplitPane 
                        split="vertical" 
                        onDragStarted={this.resizingPanel.bind(this)} 
                        onDragFinished={this.resizingPanelFinished.bind(this)}  
                        minSize={200} defaultSize={400}>
                        <div ref="panelscontainer">
                            {this.renderPageTree()}
                            <div ref="assetstreeview">
                                <AssetsTreeView />
                            </div>
                        </div>
                        <div key="tabar">
                            <TabPanel clickTab={this.clickTab.bind(this)} closeTab={this.closeTab.bind(this)} tabs={this.state.tabs} />
                        </div>
                    </SplitPane>
     
                </div>
            </div>
        )
    }

}
