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

        this.props.ee.on("assetdeleted", function(id, type){
            this.deleteItem(type, id);
        }.bind(this));
    }

    updateData() {
        return Api.getAssets().then(assets => {
            setTimeout(() =>{
                this.setState( {assets: assets, deleting: -1, adding: -1, renaming: -1, working: false} );
            },200);
        });
    }

    clickItem(id, label, type) {
        var currTime = (new Date()).getTime();
        if(currTime - this.state.lastClick < 500 && this.state.selected == id) {
            this.props.onOpen(id, type, label);
        }
        this.setState({ lastClick: currTime, selected: id })
    }

    deleteItem(type, id) {
        var assetid = id;
        if(isNaN(assetid)) {
            assetid = this.state.selected;
        }
        if(assetid == -1) {
            alert("No item selected");
            return;
        }
        if(confirm("Do you really want to delete this?")) {
            this.setState({ working: true, deleting: assetid});
            Api.deleteAsset(assetid).then(x => {
                this.updateData().then(x => {
                    this.props.onDelete(assetid, type);
                });
            })
        }
    }

    renameItem(name) {
        var assetid = this.state.selected;
        var type = this.state.newtype;
        this.setState({working: true});
        Api.renameAsset(assetid, name).then(x => {
            this.updateData().then(x => {
                this.props.onRename(assetid, type, name);
            });
        })        
    }

    addItem(name, parent_id) {
        this.setState({working: true});
        Api.addAsset(parent_id, name, "",this.state.newtype).then(x => {
            this.updateData();
        })
    }

    uploaded(uploading) {
        this.setState({showUpload: false, working: true});
        uploading.then(x => {
            Api.addAsset(this.state.selected, x.name, x.path, 'picture').then(x => {
                this.updateData();
            })
        });
    }

    onBlur() {
        this.setState({renaming: -1, adding: -1});
    }

    parentChanged(id, parent_id) {
        this.setState({working: true});
        Api.updateParentAsset(id, parent_id).then(x => {
            this.updateData();
        })
    }

    canCreate(type) {
        return type == "assetsfolder" || type == "assetshome";
    }

    contextClickAction(e, data) {
        if(data.name == "open") {
            this.props.onOpen(this.state.selected, data.type, data.label);
        } else if(data.name == "rename") {
            this.setState({renaming: this.state.selected, newtype: data.type});
        } else if(data.name == "delete") {
            this.deleteItem(data.type, this.state.selected);
        } else if(data.name == "createfolder") {
            this.setState({adding: this.state.selected, newtype: "folder"});
        } else if(data.name == "upload") {
            this.setState({showUpload: true});
        }
    }

    renderContextMenu(menuid) {
        var addsubmenu = (
            <SubMenu hoverDelay={0} title="Add...">
                 <MenuItem onClick={this.contextClickAction.bind(this)} data={{name: 'upload'}}>Upload file(s)</MenuItem>
                 <MenuItem onClick={this.contextClickAction.bind(this)} data={{name: 'createfolder'}}>Folder</MenuItem>
            </SubMenu>
        );
        return(
            <ContextMenu id={String(menuid)}>
                {this.canCreate(menuid) ? addsubmenu : null }
                <MenuItem onClick={this.contextClickAction.bind(this)} data={{name: 'open'}}>Open</MenuItem>
                {menuid != "assetshome" ? <MenuItem onClick={this.contextClickAction.bind(this)} data={{name: 'rename'}}>Rename</MenuItem> : null}
                {menuid != "assetshome" ? <MenuItem onClick={this.contextClickAction.bind(this)} data={{name: 'delete'}}>Delete</MenuItem> : null}
                <MenuItem onClick={this.contextClickAction.bind(this)} data={{name: 'rename'}}>Settings</MenuItem>
            </ContextMenu>
        )
    }

    renderTreeView(items) {
        if(items.length <= 0) return null;
        return(
            <TreeView>
                {items.map(x => 
                    <TreeViewItem
                        drop="folder"
                        id={x.id}
                        type={x.mimetype}
                        published={true}
                        deleted={this.state.deleting == x.id}
                        renaming={this.state.renaming == x.id}
                        adding={this.state.adding == x.id}
                        addicon="folder"
                        onBlur={this.onBlur.bind(this)}
                        onClick={() => this.clickItem(x.id, x.label, x.mimetype)}
                        onRename={this.renameItem.bind(this)}
                        onAdd={this.addItem.bind(this)}
                        parentChanged={this.parentChanged.bind(this)}
                        selected={this.state.selected == x.id}
                        key={x.id}
                        collapsed={x.collapsed}
                        contextMenuId={"assets" + x.mimetype}
                        onCollapse={(state) => Api.collapseAsset(x.id, state)}
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
                {this.renderContextMenu("assetshome")}
                {this.renderContextMenu("assetsfolder")}
                {this.renderContextMenu("assetspicture")}

                {this.state.working ? this.renderLoading() : null}
                {this.state.showUpload ? <UploadDialog onHide={() => this.setState({showUpload: false})} onUploaded={this.uploaded.bind(this)} /> : null}
            </div>
        )
    }
}