import React from 'react';
import {TreeView, TreeViewItem} from '../TreeView.jsx';
import * as Api from '../../api/api.js';
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import {SmallToolBar, SmallToolBarItem} from '../SmallToolBar.jsx';
import UploadDialog from '../dialogs/UploadDialog.jsx';

export default class AssetsPanel extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { lastClick: 0, working: false, deleting: -1, adding: -1, newtype: "", renaming: -1, entities: [], selected: -1 };
    }
    
    contextMenu(id, label, type) {
        return (
            <ContextMenu id={String(id) + label}>
                <MenuItem onClick={() => this.setState({showUpload: true})} data={{item: 'open'}}>Upload file</MenuItem>
                {this.canCreateFolder(type) ? <MenuItem onClick={() => this.setState({adding: id, newtype: 'folder'})} data={{item: 'open'}}>Create folder</MenuItem> : null}
                <MenuItem onClick={() => this.props.onOpen(id, type, label)} data={{item: 'open'}}>Open</MenuItem>
                <MenuItem onClick={() => this.setState({ renaming: id, newtype: type })} data={{item: 'rename'}}>Rename</MenuItem>
                <MenuItem onClick={() => this.props.callback(this.props, "dblclick")} data={{item: 'open'}}>Dublicate</MenuItem>
                <MenuItem onClick={() => this.deleteItem(type)} data={{item: 'delete'}}>Delete</MenuItem>
                <MenuItem onClick={() => this.props.callback(this.props, "dblclick")} data={{item: 'open'}}>Properties</MenuItem>
            </ContextMenu>
        )
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

    renderLoading() {
        return(
             <div className="loading"><img src="/assets/images/rolling.svg" alt="" /> </div>
        )
    }

    render() {
        if(this.state.assets.length <= 0){
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
                    {this.renderTreeView(this.state.assets)}
                </div>
                {this.state.working ? this.renderLoading() : null}
            </div>
        )
    }
}