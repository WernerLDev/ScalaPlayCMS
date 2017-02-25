import React from 'react';
import Icon from './Icon.jsx';
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import * as Api from '../api/api.js';
import * as TreeActions from '../actions/TreeViewActions.js';

export default class DraggableTreeViewItem extends React.Component {

    constructor(props, context) {
        super(props);
    }

    preventDropInOwnChild(e) {
        var targetid = e.dataTransfer.getData("id");
        var childNodes = JSON.parse(e.dataTransfer.getData("children"));
        return (targetid == this.props.id || TreeActions.isItemChild(this.props.id, childNodes)); 
    }

    onDragStart(ev) {
         ev.dataTransfer.setData("id", this.props.id);
         ev.dataTransfer.setData("children", JSON.stringify(this.props.childNodes));
        ev.target.parentNode.parentNode.style.opacity = "0.4";
    }

    onDragOver(e) {
        if(this.preventDropInOwnChild(e)) {
            return;
        }
        e.preventDefault();
        e.target.classList.add("draghover");
        return false;
    }

    onDragLeave(e) {
        if(this.preventDropInOwnChild(e)) {
            return;
        }
        e.preventDefault();
        e.target.classList.remove("draghover");
        return false;
    }

    onDragStop(ev) {
        ev.target.parentNode.parentNode.style.opacity = "1";
    }

    onDrop(e) {
        if(this.preventDropInOwnChild(e)) {
            e.target.classList.remove("draghover");
            return;
        }
        var targetid = e.dataTransfer.getData("id");
        this.props.onParentChange(targetid, this.props.id);
        e.target.classList.remove("draghover");
    }

    render() {
        var icon = (<Icon type="empty" />);
        if(this.props.collapsable) {
            icon = (<Icon click={this.props.collapseHandler} type={this.props.collapsed ? "arrow-down" : "arrow-right"} />);
        }
        return (
             <div 
                draggable="true"
                onDragStart={this.onDragStart.bind(this)}
                onDragEnd={this.onDragStop.bind(this)}
                onDragOver={this.onDragOver.bind(this)}
                onDragLeave={this.onDragLeave.bind(this)}
                onDropCapture={this.onDrop.bind(this)}
                className={this.props.selected ? "selected treeitem" : "treeitem"}
                onContextMenu={this.props.itemClicked}
                onClick={this.props.itemClicked}
            >
                  {icon} <Icon type={this.props.type} /> {this.props.label}
             </div>
        )
    }

}