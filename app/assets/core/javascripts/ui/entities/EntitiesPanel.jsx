import React from 'react';
import {TreeView, TreeViewItem} from '../uielements/TreeView.jsx';
import * as Api from '../../api/api.js';
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import {SmallToolBar, SmallToolBarItem} from '../toolbars/SmallToolBar.jsx';
import UploadDialog from '../dialogs/UploadDialog.jsx';

export default class EntitiesPanel extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { entities: [], working: true, selected: -1 };
    }

    deleteItem() {
        console.log("Not implemented yet")
    }

    renderToolbar() {
        return(
            <div className="toolbar">
                <SmallToolBar>
                    <SmallToolBarItem icon="plus" onClick={() => console.log("not implemented yet")} />
                    <SmallToolBarItem icon="trash" onClick={this.deleteItem.bind(this)} />
                    <SmallToolBarItem alignright={true} icon="refresh" onClick={() => {
                        this.setState({working: true});
                        this.updateData();
                        }} />
                </SmallToolBar>
            </div>);
    }

    renderTreeView() {
        return(
            <div>bla</div>
        )
    }

    renderLoading() {
        return(
             <div className="loading"><img src="/assets/images/rolling.svg" alt="" /> </div>
        )
    }

    render() {
        if(this.state.entities.length <= 0){
            return(
                <div>
                    {this.renderToolbar()}
                    {this.renderLoading()}
                </div>
            )
        }
        return (
            <div>
                {this.renderToolbar()}
                <div className={this.state.working ? "working treeviewcontainer" : "treeviewcontainer"}>
                    {this.renderTreeView(this.state.entities)}
                </div>
                {this.state.working ? this.renderLoading() : null}
            </div>
        )
    }
}