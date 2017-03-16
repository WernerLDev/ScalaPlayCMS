import React from 'react';
import Icon from './Icon.jsx';
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";

export class TreeViewItem extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { collapsed: props.collapsed }
    }

    collapse() {
        this.setState({ collapsed: !this.state.collapsed })
    }

    render() {
        var icon = (<Icon onClick={this.collapse.bind(this)} type={this.state.collapsed ? "arrow-down" : "arrow-right"} />);
        if(!this.props.children) icon = (<Icon type="empty" />); 
        return(
            <li>
                <ContextMenuTrigger holdToDisplay={-1} id={String(this.props.id)}>
                <div onContextMenu={this.props.onClick} onClick={this.props.onClick} className={this.props.selected ? "selected treeitem" : "treeitem"}>
                    {icon} <Icon type="file" /> {this.props.label}
                </div>
                </ContextMenuTrigger>
                <div className={this.state.collapsed ? "" : "hidden"}>{this.props.children}</div>
                {this.props.contextMenu(this.props.id)}
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
            <ul className="treeview">
                {this.props.children}
            </ul>
        )
    }

}
