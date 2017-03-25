import React from 'react';
import {TreeView, TreeViewItem} from '../TreeView.jsx';
import * as Api from '../../api/api.js';
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import {SmallToolBar, SmallToolBarItem} from '../SmallToolBar.jsx';

export default class PagesPanel extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { lastClick: 0, working: false, deleting: -1, adding: -1, newtype: "", renaming: -1, pages: [], pagetypes: [], selected: -1 };
    }

    componentDidMount() {
        Api.getDocuments().then(docs => {
            Api.getPageTypes().then(types => {
                this.setState({ pages: docs, pagetypes: types.pagetypes });
            })
        });

        this.props.ee.on("pagedeleted", function(id){
            this.deleteItem(id);
        }.bind(this));
    }

    updateData() {
        return Api.getDocuments().then(docs => {
            setTimeout(() => {
                this.setState( {pages: docs, deleting: -1, adding: -1, renaming: -1, working: false} );
            },200);
        });
    }

    clickItem(id, label) {
        var currTime = (new Date()).getTime();
        if(currTime - this.state.lastClick < 500 && this.state.selected == id) {
            this.props.onOpen(id, "file", label);
        }
        this.setState({ lastClick: currTime, selected: id })
    }

    deleteItem(id) {
        var docid = id;
        if(isNaN(docid)) {
            docid = this.state.selected;
        }

        if(docid == -1) {
            alert("No item selected");
            return;
        }
        if(confirm("Do you really want to delete this page? (This cannot be undone).")) {
            this.setState({ working: true, deleting: docid});
            Api.deleteDocument(docid).then(x => {
                this.updateData().then(y => {
                    this.props.onDelete(docid, "file");
                })
            });
        }
    }

    renameItem(name) {
        var docid = this.state.selected;
        this.setState({working: true});
        Api.renameDocument(docid, name).then(x => {
            this.updateData().then(x => this.props.onRename(docid, "file", name) );
        })
    }

    addItem(name, parent_id) {
        this.setState({working: true});
        Api.addDocument(parent_id, name, this.state.newtype).then(x => {
            this.updateData().then(y => {
                this.setState({selected: x.id});
            });
        })
    }

    onBlur() {
        this.setState({renaming: -1, adding: -1});
    }

    //Called by treeviewitem after drag event
    onParentChanged(id, parent_id) {
        this.setState({working: true});
        Api.updateParentDocument(id, parent_id).then(x => this.updateData());
    }

    isNotHome(type) {
        return type != "home";
    }

    contextMenu(id, label, type) {
        return (
            <ContextMenu id={String(id) + label}>
                <SubMenu hoverDelay={0} title="Add Page">
                    {this.state.pagetypes.map(x => <MenuItem key={x.typekey} onClick={() => this.setState({adding: id, newtype: x.typekey})}>{x.typename}</MenuItem> )}
                </SubMenu>
                <MenuItem onClick={() => this.props.onOpen(id, "file", label)} data={{item: 'open'}}>Open</MenuItem>
                {this.isNotHome ? <MenuItem onClick={() => this.props.callback(this.props, "dblclick")} data={{item: 'open'}}>Unpublish</MenuItem> : null }
                {this.isNotHome(type) ? <MenuItem onClick={() => this.setState({ renaming: id })} data={{item: 'rename'}}>Rename</MenuItem> : null }
                {this.isNotHome(type) ? <MenuItem onClick={() => this.props.callback(this.props, "dblclick")} data={{item: 'open'}}>Dublicate</MenuItem> : null }
                {this.isNotHome(type) ? <MenuItem onClick={this.deleteItem.bind(this)} data={{item: 'delete'}}>Delete</MenuItem> : null }
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
                        drop="all"
                        id={x.id} type={x.doctype}
                        deleted={this.state.deleting == x.id}
                        renaming={this.state.renaming == x.id}
                        adding={this.state.adding == x.id}
                        addicon="file"
                        onBlur={this.onBlur.bind(this)}
                        onClick={() => this.clickItem(x.id, x.label)}
                        onRename={this.renameItem.bind(this)}
                        onAdd={this.addItem.bind(this)}
                        parentChanged={this.onParentChanged.bind(this)}
                        selected={this.state.selected == x.id}
                        key={x.id} collapsed={x.collapsed}
                        contextMenu={this.contextMenu.bind(this)}
                        onCollapse={(state) => Api.collapseDocument(x.id, state)}
                        label={x.label}>{this.renderTreeView(x.children)}</TreeViewItem> )}
            </TreeView>
        );
    }

    renderToolbar() {
        return(
            <div className="toolbar">
                <SmallToolBar>
                    <SmallToolBarItem icon="plus" onClick={() => console.log("not implemented yet")} />
                    <SmallToolBarItem icon="trash" onClick={this.deleteItem.bind(this)} />
                    <SmallToolBarItem alignright={true} icon="refresh" onClick={() => {
                        this.setState({working: true}, () => {
                            this.updateData();
                        });
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
        if(this.state.pages.length <= 0){
            return(
                <div>
                    {this.renderToolbar()}
                    {this.renderLoading()}
                </div>
            )
        }
        return (
            <div>
                {this.state.working ? this.renderLoading() : null}
                {this.renderToolbar()}
                <div className={this.state.working ? "working treeviewcontainer" : "treeviewcontainer"}>
                    {this.renderTreeView(this.state.pages)}
                </div>
            </div>
        )
    }
}


/*
<li><i className="fa fa-plus" aria-hidden="true"></i></li>
                    <li><i className="fa fa-trash" aria-hidden="true"></i></li>
                    <li className="tool-right"><i className="fa fa-refresh" aria-hidden="true"></i></li>
                    */

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