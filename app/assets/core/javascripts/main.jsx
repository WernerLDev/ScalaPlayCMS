import React from 'react';
import SideMenu from './ui/sidemenu.jsx';
import PanelTreeView from './ui/PanelTreeView.jsx';
import TabPanel from './ui/TabPanel.jsx';
import * as TabActions from './actions/TabViewActions.js';

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

    render() {
        return(
            <div>
                <SideMenu />
                <PanelTreeView renameItem={this.itemRenamed.bind(this)} deleteItem={(id) => this.deleteItem(id)} dblclick={this.onTreeDblClick.bind(this)} />
                <div className="area-right">
                    <TabPanel clickTab={this.clickTab.bind(this)} closeTab={this.closeTab.bind(this)} tabs={this.state.tabs} />
                </div>
            </div>
        )
    }

}
