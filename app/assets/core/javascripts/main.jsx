import React from 'react';
import {SideMenu, SideMenuItem} from './ui/sidemenu.jsx';
import SplitPane from 'react-split-pane';
import * as SplitPaneActions from './actions/SplitPaneActions.js';
import PagesPanel from './ui/panels/PagesPanel.jsx';
import TabPanel from './ui/panels/TabPanel.jsx';

export default class Main extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { section: "pages" }
    }

    switchSection(section) {
        if(this.state.section == section) SplitPaneActions.hideLeftPanel(this.refs.leftpane);
        if(this.state.section == "") SplitPaneActions.showLeftPanel(this.refs.leftpane); 
        this.setState({section: section == this.state.section ? "" : section});
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
                                <PagesPanel />
                            </div>
                            <div className={this.state.section == "entities" ? "visible" : "hidden"}>
                                Entities
                            </div>
                            <div className={this.state.section == "assets" ? "visible" : "hidden"}>
                                Assets
                            </div>
                            <div className={this.state.section == "settings" ? "visible" : "hidden"}>
                                Settings
                            </div>
                        </div>
                        <div key="tabar">
                            <TabPanel />
                        </div>
                    </SplitPane>
     
                </div>
            </div>
        )
    }

}
