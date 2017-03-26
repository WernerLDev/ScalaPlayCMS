import React from 'react';
import Icon from './Icon.jsx';
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import * as Api from '../api/api.js';

class TreeViewListItem extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return(
            <li className={this.props.deleted ? "deleted" : ""}>
                {this.props.children}
            </li>
        );
    }
}

class TreeViewItemLabel extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    onDragStart(e) {
         e.dataTransfer.setData("id", this.props.id);
         e.target.parentNode.parentNode.style.opacity = "0.4";
         var subitems = e.target.parentNode.parentNode.getElementsByClassName("treeitem");
         [].forEach.call(subitems, function(elem){
            elem.classList.add("nondraggable");
         });
         [].forEach.call(document.getElementsByClassName("treeitemclickarea"), function(elem){
            elem.style.display = "none";
         });
    }

    onDragStop(e) {
         e.target.parentNode.parentNode.style.opacity = "1";
         var subitems = e.target.parentNode.parentNode.getElementsByClassName("treeitem");
         [].forEach.call(subitems, function(elem){
            elem.classList.remove("nondraggable");
         });
         [].forEach.call(document.getElementsByClassName("treeitemclickarea"), function(elem){
            elem.style.display = "block";
            console.log("adding back thing")
         });
    }

    onDragOver(e) {
        if(e.target.classList.contains("nondraggable")) {
            return;
        }
        e.preventDefault();
        e.target.classList.add("draghover");
        return false;
    }

    onDragLeave(e) {
        if(e.target.classList.contains("nondraggable")) {
            return;
        }
        e.preventDefault();
        e.target.classList.remove("draghover");
        return false;
    }

    onDrop(e) {
        e.target.classList.remove("draghover");
        var targetid = e.dataTransfer.getData("id");
        this.props.parentChanged(targetid, this.props.id);
    }

    render() {
        if(this.props.drop == "all" || this.props.type == this.props.drop) {
            return(
                <div
                    draggable="true"
                    onDragStart={this.onDragStart.bind(this)}
                    onDragEnd={this.onDragStop.bind(this)}
                    onDragOver={this.onDragOver.bind(this)}
                    onDragLeave={this.onDragLeave.bind(this)}
                    onDropCapture={this.onDrop.bind(this)}
                    onContextMenu={this.props.onContextMenu}
                    className={this.props.selected ? "selected treeitem" : "treeitem"}>
                    {this.props.children}
                </div>
            )
        } else {
            return (
                <div 
                    draggable="true"
                    onContextMenu={this.props.onContextMenu}
                    className={this.props.selected ? "selected nondraggable treeitem" : "nondraggable treeitem"}
                    onDragStart={this.onDragStart.bind(this)}
                    onDragEnd={this.onDragStop.bind(this)}
                    >
                    {this.props.children}
                </div>)
        }
    }
}


export class TreeViewItem extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { collapsed: props.collapsed, inputvalue: "" }
    }

    collapse() {
        //Api.collapseDocument(this.props.id, !this.state.collapsed);
        this.setState({ collapsed: !this.state.collapsed }, () => {
            this.props.onCollapse(this.state.collapsed);
        })
    }

    keypress(e) {
        if(e.keyCode == 13) {
            if(this.props.renaming) {
                this.props.onRename(this.state.inputvalue)
            } else if(this.props.adding) {
                this.props.onAdd(this.state.inputvalue, this.props.id);
            }
        }
    }

    renderLabel() {
        if(this.props.renaming) {
            return(
                <input autoFocus type="text" className="treeviewinputEdit" defaultValue={this.props.label} 
                onBlur={this.props.onBlur} onKeyUp={this.keypress.bind(this)}
                onChange={(x) => this.setState({inputvalue: x.currentTarget.value })} />
            )
        } else {
            return(this.props.label)
        }
    }

    renderNewForm() {
        return(<ul>
            <li>
                <div className={"treeitem"}>
                <Icon type="empty"/> <Icon type={this.props.addicon} />
                <input autoFocus placeholder="New item name" type="text"
                    onKeyUp={this.keypress.bind(this)}
                    onChange={(e) => this.setState({inputvalue: e.currentTarget.value})}
                    className="treeviewinput" onBlur={this.props.onBlur} />
                </div>
            </li>
        </ul>);
    }

    collect(props) {
        return { label: props.label }
    }

    render() {
        var icon = (<Icon onClick={this.collapse.bind(this)} type={this.state.collapsed ? "arrow-down" : "arrow-right"} />);
        if(!this.props.children) icon = (<Icon type="empty" />); 
        var typeicon = this.props.type;
        if(this.props.type == "folder" && this.state.collapsed) typeicon = "folder-open";

        return(
            <TreeViewListItem type={this.props.type} drop={this.props.drop} deleted={this.props.deleted}>
                <ContextMenuTrigger holdToDisplay={-1} id={this.props.contextMenuId} collect={this.collect} label={this.props.label}>
                <TreeViewItemLabel
                    drop={this.props.drop}
                    type={this.props.type}
                    id={this.props.id}
                    parentChanged={this.props.parentChanged}
                    onContextMenu={this.props.onClick}
                    selected={this.props.selected}>
                    {icon} <Icon type={typeicon} /> {this.renderLabel()}
                    {this.props.renaming ? null : <div onClick={this.props.onClick} className="treeitemclickarea"></div>}
                </TreeViewItemLabel>

                </ContextMenuTrigger>
                {this.props.adding ? this.renderNewForm() : null}
                <div className={this.state.collapsed ? "" : "hidden"}>{this.props.children}</div>
               
            </TreeViewListItem>
        )
    } 
}

// {this.props.contextMenu(this.props.id, this.props.label, this.props.type)}



export class TreeView extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <ul>
                {this.props.children}
            </ul>
        )
    }

}
