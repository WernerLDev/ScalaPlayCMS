import React from 'react';
import {TreeView, TreeViewItem} from '../TreeView.jsx';
import * as Api from '../../api/api.js';
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import {SmallToolBar, SmallToolBarItem} from '../SmallToolBar.jsx';

export default class PagesPanel extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { lastClick: 0, working: false, deleting: -1, adding: -1, newtype: "", renaming: -1, pages: [], pagetypes: [], selected: -1, selectedType: "" };
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

        this.props.ee.on("pagePublishDateSet", function(id){
            this.updateData();
        }.bind(this));
    }

    updateData() {
        return Api.getDocuments().then(docs => {
            setTimeout(() => {
                this.setState( {pages: docs, deleting: -1, adding: -1, renaming: -1, working: false} );
            },200);
        });
    }

    clickItem(x) {
        var currTime = (new Date()).getTime();
        if(currTime - this.state.lastClick < 500 && this.state.selected.id == x.id) {
            this.props.onOpen(x.id, "page", x.label);
        }
        this.setState({ lastClick: currTime, selected: x, selectedType: x.doctype })
    }

    deleteItem(item) {
        var docid = 0;
        //if(item == -1) {
        if(isNaN(docid)) {
            docid = this.state.selected.id;
        } else {
            docid = item.id;
        }

        if(docid == -1) {
            alert("No item selected");
            return;
        }
        if(confirm("Do you really want to delete this page? (This cannot be undone).")) {
            this.setState({ working: true, deleting: docid}, () => {
                Api.deleteDocument(docid).then(x => {
                    this.updateData().then(y => {
                        this.props.onDelete(docid, "page");
                    })
                });
            });
        }
    }

    renameItem(name, item) {
        var docid = item.id;
        this.setState({working: true});
        Api.renameDocument(docid, name).then(x => {
            this.updateData().then(x => this.props.onRename(docid, "page", name) );
        })
    }

    addItem(name, item) {
        this.setState({working: true});
        Api.addDocument(item.id, name, this.state.newtype).then(x => {
            this.updateData().then(y => {
                this.setState({selected: x});
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

    contextClickAction(e, data) {
        if(data.name == "open") {
            this.props.onOpen(this.state.selected.id, "page", data.label);
        } else if(data.name == "rename") {
            this.setState({renaming: this.state.selected.id});
        } else if(data.name == "delete") {
            this.deleteItem(this.state.selected);
        } else if(data.name == "add") {
            this.setState({adding: this.state.selected.id, newtype: data.newtype});
        } else if(data.name == "properties") {
            this.props.ee.emitEvent("pageproperties", [this.state.selected.id]);
        }
    }

    renderContextMenu(menuid) {
        return(
            <ContextMenu id={String(menuid)}>
                <SubMenu hoverDelay={0} title="Add Page">
                    {this.state.pagetypes.map(x => <MenuItem key={x.typekey} onClick={this.contextClickAction.bind(this)} data={{name: 'add', newtype: x.typekey}}>{x.typename}</MenuItem> )}
                </SubMenu>
                <MenuItem onClick={this.contextClickAction.bind(this)} data={{name: 'open'}}>Open</MenuItem>
                {menuid != "home" ? <MenuItem onClick={this.contextClickAction.bind(this)} data={{name: 'rename'}}>Rename</MenuItem> : null}
                {menuid != "home" ? <MenuItem onClick={this.contextClickAction.bind(this)} data={{name: 'delete'}}>Delete</MenuItem> : null}
                <MenuItem onClick={this.contextClickAction.bind(this)} data={{name: 'rename'}}>Dublicate</MenuItem>
                <MenuItem onClick={this.contextClickAction.bind(this)} data={{name: 'properties'}}>Properties</MenuItem>
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
                        item={x}
                        id={x.id} type={x.doctype}
                        published={x.published}
                        deleted={this.state.deleting == x.id}
                        renaming={this.state.renaming == x.id}
                        adding={this.state.adding == x.id}
                        addicon="page"
                        onBlur={this.onBlur.bind(this)}
                        onClick={() => this.clickItem(x)}
                        onRename={this.renameItem.bind(this)}
                        onAdd={this.addItem.bind(this)}
                        parentChanged={this.onParentChanged.bind(this)}
                        selected={this.state.selected.id == x.id}
                        key={x.id} collapsed={x.collapsed}
                        contextMenuId={x.doctype == "home" ? "home" : "page"}
                        onCollapse={(state) => Api.collapseDocument(x.id, state)}
                        label={x.label}>{this.renderTreeView(x.children)}</TreeViewItem> )}
            </TreeView>
        );
    }

    renderToolbar() {
        let pageAdd = (type) => {
            this.setState({adding: this.state.selected.id, newtype: type});
        };
        let canDelete = () => this.state.selectedType != "" && this.state.selectedType != "home";
        return(
            <div className="toolbar">
                <SmallToolBar>
                    <SmallToolBarItem disabled={this.state.selected == -1} icon="plus" toggleChildren={true}>
                        <div className="submenu">
                            <nav className="react-contextmenu">
                                {this.state.pagetypes.map(x => <div className="react-contextmenu-item" key={x.typekey} onClick={() => pageAdd(x.typekey)}>{x.typename}</div> )}
                            </nav>
                        </div>
                    </SmallToolBarItem>
                    <SmallToolBarItem disabled={canDelete() == false} icon="trash" onClick={this.deleteItem.bind(this)} />
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
                    {this.renderContextMenu("page")}
                    {this.renderContextMenu("home")}
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