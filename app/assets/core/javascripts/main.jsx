import React from 'react';
import {SideMenu, SideMenuItem} from './ui/sidemenu.jsx';
import SplitPane from 'react-split-pane';
import * as SplitPaneActions from './actions/SplitPaneActions.js';
import PagesPanel from './ui/panels/PagesPanel.jsx';
import {TabPanel, Tab, TabsList, TabContent} from './ui/panels/TabPanel.jsx';
import PageEditPanel from './ui/panels/PageEditPanel.jsx';
import * as TabsAction from './actions/TabViewActions.js';
import _ from 'lodash/fp';
import AssetsPanel from './ui/panels/AssetsPanel.jsx';
import ImageViewer from './ui/panels/ImageViewer.jsx';
import EventEmitter from 'wolfy87-eventemitter';

export default class Main extends React.Component {

    constructor(props, context) {
        super(props, context);
        var initialTabs = TabsAction.getInitialTabs();
        this.state = { section: "pages", activetab: 0, tabs: initialTabs, ee: new EventEmitter() }
    }

    switchSection(section) {
        
        
        if(this.state.section == section) SplitPaneActions.hideLeftPanel(this.refs.leftpane);
        if(this.state.section == "") SplitPaneActions.showLeftPanel(this.refs.leftpane); 
        this.setState({section: section == this.state.section ? "" : section});
    }

    switchTab(tabid) {
        this.setState({activetab: tabid});
    }

    closeTab(tabid) {
        var newtabs = this.state.tabs.filter(x => x.id != tabid);
        var newactive = this.state.activetab;
        if(tabid == this.state.activetab) {
            newactive = TabsAction.findNewActive(tabid, this.state.tabs);
        }
        this.setState({ tabs: newtabs, activetab: newactive })
    }

    openTab(id, type, label) {
        var content = (<div>{label}</div>);
        if(type == "file") {
            content = (<PageEditPanel ee={this.state.ee} id={id} />);
        } else if(type == "picture") {
            content = (<ImageViewer ee={this.state.ee} id={id} />)
        }
        var newTab = {
            id: id + type,
            type: type,
            label: label,
            content: content
        }
        if(this.state.tabs.filter(x => x.id == newTab.id).length > 0) {
            this.setState({ activetab: newTab.id })
        } else {
            this.setState({ tabs: _.union([newTab], this.state.tabs), activetab: newTab.id });
        }
    }

    renameTab(id, type, name) {
        var tabid = id + type;
        var newtabs = this.state.tabs.map(function(tab){
            if(tab.id == tabid) {
                tab.label = name;
                return tab;
            } else  {
                return tab;
            }
        });
        this.setState({tabs: newtabs});
    }

    render() {
        return(
            <div>
                <SideMenu>
                    <SideMenuItem 
                        active={this.state.section == "home"} icon="home" 
                        onClick={() => this.switchSection("home")} >DashBoard</SideMenuItem>
                    <SideMenuItem 
                        active={this.state.section == "pages"} icon="files-o" 
                        onClick={() => this.switchSection("pages")} >Pages</SideMenuItem>
                    <SideMenuItem 
                        active={this.state.section == "entities"} icon="cubes"
                        onClick={() => this.switchSection("entities")} >Entities</SideMenuItem>
                    <SideMenuItem 
                        active={this.state.section == "assets"} icon="picture-o"
                        onClick={() => this.switchSection("assets")} >Assets</SideMenuItem>
                    <SideMenuItem
                        active={this.state.section == "settings"} icon="gears" 
                        onClick={() => this.switchSection("settings")} >Settings</SideMenuItem>
                </SideMenu>
                <div className="splitpane-container">
                    <SplitPane 
                        split="vertical" 
                        onDragStarted={SplitPaneActions.resizingPanel.bind(this)} 
                        onDragFinished={SplitPaneActions.resizingPanelFinished.bind(this)}  
                        minSize={200} defaultSize={400}>
                        <div className="leftpane" ref="leftpane">
                            <div className={this.state.section == "home" ? "visible" : "hidden"}>
                                Dashboard
                            </div>
                            <div className={this.state.section == "pages" ? "visible tree" : "hidden"}>
                                <PagesPanel
                                ee={this.state.ee}
                                onOpen={this.openTab.bind(this)}
                                onRename={this.renameTab.bind(this)}
                                onDelete={(id, type) => this.closeTab(id + type)} />
                            </div>
                            <div className={this.state.section == "entities" ? "visible" : "hidden"}>
                                Entities

                                
                            </div>
                            <div className={this.state.section == "assets" ? "visible tree" : "hidden"}>
                                <AssetsPanel 
                                    ee={this.state.ee}
                                    onOpen={this.openTab.bind(this)}
                                    onRename={this.renameTab.bind(this)}
                                    onDelete={(id, type) => this.closeTab(id + type)} />
                            </div>
                            <div className={this.state.section == "settings" ? "visible" : "hidden"}>
                                Settings
                            </div>
                        </div>
                        <div key="tabar">
                            <TabsList active={this.state.activetab} onClose={this.closeTab.bind(this)} onClick={this.switchTab.bind(this)}>
                                {this.state.tabs.map(t => <Tab key={t.id} id={t.id} label={t.label} type={t.type} />)}
                            </TabsList>

                            {this.state.tabs.map(t => <TabContent key={t.id} active={this.state.activetab == t.id}>{t.content}</TabContent>)}
                        </div>
                    </SplitPane>
     
                </div>
            </div>
        )
    }
}
