import React from 'react';
import {TreeView, TreeViewItem} from '../TreeView.jsx';
import * as Api from '../../api/api.js';
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";

export default class PagesPanel extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { pages: [], selected: -1 };
    }

    componentDidMount() {
        Api.getDocuments().then(docs => {
            this.setState({ pages: docs, selected: this.state.selected });
        });
    }

    clickItem(id) {
        this.setState({ pages: this.state.pages, selected: id })
    }

    deleteItem() {
        console.log("Deleting?" + this.state.selected);
    }

    contextMenu(id) {
        return (
            <ContextMenu id={String(id)}>
                <SubMenu hoverDelay={0} title="Add Page">
                <MenuItem  data={{item: 'open'}}>Default</MenuItem>
                <MenuItem  data={{item: 'open'}}>Test</MenuItem>
                </SubMenu>
                <MenuItem onClick={() => this.props.callback(this.props, "dblclick")} data={{item: 'open'}}>Open</MenuItem>
                <MenuItem onClick={() => this.props.callback(this.props, "dblclick")} data={{item: 'open'}}>Unpublish</MenuItem>
                <MenuItem onClick={() => console.log("renaming")} data={{item: 'rename'}}>Rename</MenuItem>
                <MenuItem onClick={() => this.props.callback(this.props, "dblclick")} data={{item: 'open'}}>Dublicate</MenuItem>
                <MenuItem onClick={this.deleteItem.bind(this)} data={{item: 'delete'}}>Delete</MenuItem>
                <MenuItem onClick={() => this.props.callback(this.props, "dblclick")} data={{item: 'open'}}>Settings</MenuItem>
            </ContextMenu>
        )
    }

    renderTreeView(items) {
        if(items.length <= 0) return null;
        return(
            <TreeView>
                {items.map(x => 
                    <TreeViewItem
                        id={x.id}
                        onClick={() => this.clickItem(x.id)}
                        selected={this.state.selected == x.id}
                        key={x.key} collapsed={x.collapsed}
                        contextMenu={this.contextMenu.bind(this)}
                        label={x.label}>{this.renderTreeView(x.children)}</TreeViewItem> )}
            </TreeView>
        );
    }

    render() {
        return (
            <div>
                {this.renderTreeView(this.state.pages)}
            </div>
        )
    }
}

/*

            <TreeView>
                <TreeViewItem collapsed={true} label="Home">
                    <TreeView>
                        <TreeViewItem label="test" />
                        <TreeViewItem label="blaat" />
                        <TreeViewItem collapsed={true} label="withsub">
                            <TreeView>
                                <TreeViewItem label="asdfasfd" />
                                <TreeViewItem label="bladiebla" />
                            </TreeView>
                        </TreeViewItem>
                        <TreeViewItem label="withoutsub" />
                    </TreeView>
                </TreeViewItem>
            </TreeView>
*/