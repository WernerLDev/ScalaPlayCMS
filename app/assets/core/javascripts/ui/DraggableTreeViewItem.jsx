import React from 'react';
import Icon from './Icon.jsx';
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import * as Api from '../api/api.js';

export default class DraggableTreeViewItem extends React.Component {

    constructor(props, context) {
        super(props);
    }

    onDragStart(ev) {
         ev.dataTransfer.setData("id", this.props.id);
    }

    onDragOver(e) {
        e.preventDefault();
        e.target.classList.add("draghover");
        return false;
    }

    onDragLeave(e) {
        e.preventDefault();
        e.target.classList.remove("draghover");
        return false;
    }

    onDragStop() {
        //console.log("Stop dragging");
    }

    onDrop(e) {
        this.props.onParentChange(e.dataTransfer.getData("id"), this.props.id);
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