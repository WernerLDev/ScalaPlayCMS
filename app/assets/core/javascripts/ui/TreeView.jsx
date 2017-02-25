import React from 'react';
import Icon from './Icon.jsx';
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import * as Api from '../api/api.js';
import DraggableTreeViewItem from './DraggableTreeViewItem.jsx';

export default class TreeView extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            lastClick: (new Date()).getTime(),
            deleted: false,
            newitem: false,
            newitemname: "",
            updating: false,
            renaming: false
        }
    }

    collapseHandler() {
        this.props.callback(this.props, "collapse");
    }

    itemClicked() {
        var currTime = (new Date()).getTime();
        if(currTime - this.state.lastClick < 500) {
            this.props.callback(this.props, "dblclick");
        } else {
            this.props.callback(this.props, "select");
        }
        this.setState({ lastClick: currTime, deleted: this.state.deleted, newitem: this.state.newitem })
    }

    handleClick() {
        console.log("clicked contextmenu item for " + this.props.label)
    }

    deleteItem() {
        this.setState({lastClick: this.state.lastClick, deleted: true, newitem: this.state.newitem })
        this.props.callback(this.props, "delete");
    }

    newItem() {
        this.setState({ lastclick: this.state.lastclick, deleted: this.state.deleted, newitem: true })
    }

    hideNewItem() {
        this.setState({ lastclick: this.state.lastclick, deleted: this.state.deleted, newitem: false })
    }

    keypress(e) {
        if(e.keyCode == 13) {
            this.setState({updating: true })
            Api.addDocument(this.props.id, this.state.newitemname).then(r => {
                this.props.callback({id: r.id, label: this.state.newitemname}, "newitemadded");
                this.setState({ newitemname: "", newitem: false, updating: false })
            })
        } else {
            this.setState({ newitemname: e.currentTarget.value })
        }
    }

    editKeyPress(e) {
        if(e.keyCode == 13) {
            this.setState({updating: true});
            Api.renameDocument(this.props.id, this.state.newitemname).then(r => {
                this.props.callback({id: this.props.id, name:this.state.newitemname}, "refresh");
                this.setState({newitemname: "", updating: false, renaming: false});
            })
        } else {
            this.setState({ newitemname: e.currentTarget.value })
        }
    }

    updateParent(id, parent_id) {
        this.props.callback({id: id, parent_id: parent_id}, "updateparent");
    }

    contextMenu() {
        return (
            <ContextMenu id={String(this.props.id)}>
                <SubMenu hoverDelay={0} title="Add">
                <SubMenu hoverDelay={0} title="Page">
                    <MenuItem onClick={this.newItem.bind(this)} data={{item: 'newdefaultpage'}}>Default page</MenuItem>
                    <MenuItem onClick={this.handleClick.bind(this)} data={{item: 'newfolder'}}>Photo gallery</MenuItem>
                    <MenuItem onClick={this.handleClick.bind(this)} data={{item: 'newfolder'}}>Product page</MenuItem>
                </SubMenu>
                <MenuItem onClick={this.handleClick.bind(this)} data={{item: 'newfolder'}}>Link</MenuItem>
                <MenuItem onClick={this.handleClick.bind(this)} data={{item: 'newfolder'}}>Snippet</MenuItem>
                </SubMenu>
                <MenuItem onClick={() => this.props.callback(this.props, "dblclick")} data={{item: 'open'}}>Open</MenuItem>
                <MenuItem onClick={() => this.props.callback(this.props, "dblclick")} data={{item: 'open'}}>Unpublish</MenuItem>
                <MenuItem onClick={() => this.setState({renaming: true, newitemname: this.props.label})} data={{item: 'rename'}}>Rename</MenuItem>
                <MenuItem onClick={() => this.props.callback(this.props, "dblclick")} data={{item: 'open'}}>Dublicate</MenuItem>
                <MenuItem onClick={this.deleteItem.bind(this)} data={{item: 'delete'}}>Delete</MenuItem>
                <MenuItem onClick={() => this.props.callback(this.props, "dblclick")} data={{item: 'open'}}>Settings</MenuItem>
            </ContextMenu>
        )
    }

    render() {
        var newitemform = "";
        if(this.state.newitem) {
            newitemform = (
                <ul>
                    <li>
                        <div className={this.state.updating? "treeitem adding" : "treeitem"}>
                        <Icon type="empty"/> <Icon type="file" /> <input disabled={this.state.updating} onKeyUp={this.keypress.bind(this)} className="treeviewinput" autoFocus placeholder="New item name" onBlur={this.hideNewItem.bind(this)} type="text" />
                        </div>
                    </li>
                </ul>
            )
        }
        var label = this.props.label;
        if(this.state.renaming) {
            label = (
                <input autoFocus disabled={this.state.updating} onBlur={() =>this.setState({renaming: false})} onKeyUp={this.editKeyPress.bind(this)} className="treeviewinputEdit" type="text" defaultValue={this.props.label} />
            )
        }

        if(this.props.children.length > 0) {
            return(
                <ul>
                    <li className={this.state.deleted ? "deleted" : ""}>
                        <ContextMenuTrigger holdToDisplay={-1} id={String(this.props.id)}>
                        <DraggableTreeViewItem
                            id={this.props.id}
                            selected={this.props.selected}
                            type={this.props.type}
                            itemClicked={this.itemClicked.bind(this)}
                            label={label}
                            collapsable={true}
                            collapsed={this.props.collapsed}
                            collapseHandler={this.collapseHandler.bind(this)}
                            onParentChange={this.updateParent.bind(this)}
                        />
                        </ContextMenuTrigger>
                        {newitemform}
                        {this.props.collapsed ? this.props.children.map((x) => <TreeView id={x.id} selected={x.selected} type={x.doctype} collapsed={x.collapsed} key={x.id} label={x.label} callback={this.props.callback} children={x.children} />) : ""}
                    </li>
                    {this.contextMenu()}
                </ul>    
            )
        } else {
            return (<ul>
                <li className={this.state.deleted ? "deleted" : ""}> 
                    <ContextMenuTrigger holdToDisplay={-1} id={String(this.props.id)}>
                    <DraggableTreeViewItem
                        id={this.props.id}
                        selected={this.props.selected}
                        type={this.props.type}
                        itemClicked={this.itemClicked.bind(this)}
                        label={label}
                        collapsable={false}
                        onParentChange={this.updateParent.bind(this)}
                    />
                    </ContextMenuTrigger>
                    {newitemform}
                </li>
               
                {this.contextMenu()}
            </ul>)
        }
    }
}
