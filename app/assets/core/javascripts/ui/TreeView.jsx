import React from 'react';
import Icon from './Icon.jsx';
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import * as Api from '../api/api.js';

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
    }

    onDragStop(e) {
         e.target.parentNode.parentNode.style.opacity = "1";
         var subitems = e.target.parentNode.parentNode.getElementsByClassName("treeitem");
         [].forEach.call(subitems, function(elem){
            elem.classList.remove("nondraggable");
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
        var targetid = e.dataTransfer.getData("id");
        e.target.classList.remove("draghover");
        this.props.parentChanged(targetid, this.props.id);
    }

    render() {
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
    }
}


export class TreeViewItem extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { collapsed: props.collapsed, inputvalue: "" }
    }

    collapse() {
        Api.collapseDocument(this.props.id, !this.state.collapsed);
        this.setState({ collapsed: !this.state.collapsed })
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

    render() {
        var icon = (<Icon onClick={this.collapse.bind(this)} type={this.state.collapsed ? "arrow-down" : "arrow-right"} />);
        if(!this.props.children) icon = (<Icon type="empty" />); 
        return(
            <li className={this.props.deleted ? "deleted" : ""}>
                <ContextMenuTrigger holdToDisplay={-1} id={String(this.props.id) + this.props.label}>
                <TreeViewItemLabel
                    id={this.props.id}
                    parentChanged={this.props.parentChanged}
                    onContextMenu={this.props.onClick}
                    selected={this.props.selected}>
                    {icon} <Icon type={this.props.type} /> {this.renderLabel()}
                    {this.props.renaming ? null : <div onClick={this.props.onClick} className="treeitemclickarea"></div>}
                </TreeViewItemLabel>

                </ContextMenuTrigger>
                {this.props.adding ? this.renderNewForm() : null}
                <div className={this.state.collapsed ? "" : "hidden"}>{this.props.children}</div>
                {this.props.contextMenu(this.props.id, this.props.label, this.props.type)}
            </li>
        )
    }
}




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
