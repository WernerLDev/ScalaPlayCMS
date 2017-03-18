import React from 'react';
import {TreeView, TreeViewItem} from '../TreeView.jsx';
import * as Api from '../../api/api.js';
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import {SmallToolBar, SmallToolBarItem} from '../SmallToolBar.jsx';
import UploadDialog from '../dialogs/UploadDialog.jsx';

export default class AssetsPanel extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { showUpload: false, lastClick: 0, working: false, deleting: -1, adding: -1, newtype: "", renaming: -1, assets: [], selected: -1 };
    }

    componentDidMount() {
        Api.getAssets().then(assets => {
            this.setState({ assets: assets });
        });
    }

    updateData() {
        return Api.getAssets().then(assets => {
            this.setState( {assets: assets, deleting: -1, adding: -1, renaming: -1, working: false} );
        });
    }

    clickItem(id, label) {
        var currTime = (new Date()).getTime();
        if(currTime - this.state.lastClick < 500 && this.state.selected == id) {
            this.props.onOpen(id, "asset", label);
        }
        this.setState({ lastClick: currTime, selected: id })
    }

    deleteItem() {
        if(this.state.selected == -1) {
            alert("No item selected");
            return;
        }
        var assetid = this.state.selected;
        this.setState({ working: true, deleting: assetid});
        /*Api.deleteDocument(assetid).then(x => {
            this.updateData().then(y => {
                this.props.onDelete(docid, "asset");
            })
        });*/
    }

    renameItem(name) {
        var docid = this.state.selected;
        this.setState({working: true});
        /*Api.renameDocument(docid, name).then(x => {
            this.updateData().then(x => this.props.onRename(docid, "asset", name) );
        })*/
    }

    addItem(name, parent_id) {
        this.setState({working: true});
        /*Api.addDocument(parent_id, name, this.state.newtype).then(x => {
            this.updateData().then(y => {
                this.setState({selected: x.id});
            });
        })*/
    }

    onBlur() {
        this.setState({renaming: -1, adding: -1});
    }

    parentChanged(id, parent_id) {
        this.setState({working: true});
        //Api.updateParentDocument(id, parent_id).then(x => this.updateData());
    }

    contextMenu(id, label) {
        return (
            <ContextMenu id={String(id) + label}>
                <MenuItem onClick={() => this.setState({showUpload: true})} data={{item: 'open'}}>Upload file</MenuItem>
                <MenuItem onClick={() => this.props.onOpen(id, "asset", label)} data={{item: 'open'}}>Open</MenuItem>
                <MenuItem onClick={() => this.setState({ renaming: id })} data={{item: 'rename'}}>Rename</MenuItem>
                <MenuItem onClick={() => this.props.callback(this.props, "dblclick")} data={{item: 'open'}}>Dublicate</MenuItem>
                <MenuItem onClick={this.deleteItem.bind(this)} data={{item: 'delete'}}>Delete</MenuItem>
                <MenuItem onClick={() => this.props.callback(this.props, "dblclick")} data={{item: 'open'}}>Properties</MenuItem>
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
                        type={x.mimetype}
                        deleted={this.state.deleting == x.id}
                        renaming={this.state.renaming == x.id}
                        adding={this.state.adding == x.id}
                        onBlur={this.onBlur.bind(this)}
                        onClick={() => this.clickItem(x.id, x.label)}
                        onRename={this.renameItem.bind(this)}
                        onAdd={this.addItem.bind(this)}
                        parentChanged={this.parentChanged.bind(this)}
                        selected={this.state.selected == x.id}
                        key={x.id}
                        collapsed={x.collapsed}
                        contextMenu={this.contextMenu.bind(this)}
                        label={x.label}>{this.renderTreeView(x.children)}</TreeViewItem> )}
            </TreeView>
        );
    }

    uploaded(uploading) {
        this.setState({showUpload: false, working: true});
        uploading.then(x => {
            Api.addAsset(this.state.selected, x.name, x.path, 'picture').then(x => {
                this.updateData();
            })
        });
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
                {this.state.showUpload ? <UploadDialog onUploaded={this.uploaded.bind(this)} /> : null}
            </div>
        )
    }
}