import React from 'react';
import ReactDOM from 'react-dom';
import {TreeView, TreeViewItem} from '../uielements/TreeView.jsx';
import * as Api from '../../api/api.js';
import {SmallToolBar, SmallToolBarItem} from '../toolbars/SmallToolBar.jsx';
import UploadDialog from '../dialogs/UploadDialog.jsx';
import AssetsContextMenu from './AssetsContextMenu.jsx';

export default class AssetsTreePanel extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { showUpload: false, lastClick: 0, working: false, deleting: -1, adding: -1, newtype: "", renaming: -1, assets: [], selected: -1, selectedType: "" };
    }

    componentDidMount() {
        Api.getAssets().then(assets => {
            this.setState({ assets: assets });
        });

        this.props.ee.on("assetdeleted", function(id, type){
            this.deleteItem(type, id);
        }.bind(this));
        
        document.addEventListener('mousedown', function(e){
            var contextMenus = document.getElementsByClassName("react-contextmenu");
            var menuOpened = false;
            [].forEach.call(contextMenus, function(menu){
                if(menu.style.opacity == 1) {
                    menuOpened = true;
                }
            }.bind(this));
            if(!ReactDOM.findDOMNode(this.refs.tree).contains(e.target) && menuOpened == false) {
                this.setState({selected: -1});
            }
        }.bind(this));
    }

    updateData() {
        return Api.getAssets().then(assets => {
            this.setState( {assets: assets, deleting: -1, adding: -1, renaming: -1, working: false} );
        });
    }

    clickItem(item) {
        var currTime = (new Date()).getTime();
        if(currTime - this.state.lastClick < 500 && this.state.selected.id == item.id) {
            this.props.onOpen(item.id, item.mimetype, item.label);
        }
        this.setState({ lastClick: currTime, selected: item, selectedType: item.mimetype })
    }

    deleteItem(type, id) {
        var assetid = id;
        if(isNaN(assetid)) {
            assetid = this.state.selected.id;
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

    renameItem(name, item) {
        var assetid = item.id;
        var type = this.state.newtype;
        this.setState({working: true});
        Api.renameAsset(assetid, name).then(x => {
            this.updateData().then(x => {
                this.props.onRename(assetid, type, name);
            });
        })        
    }

    addItem(name, parent) {
        this.setState({working: true});
        Api.addAsset(parent.id, name, "",this.state.newtype).then(x => {
            this.updateData();
        })
    }

    uploaded(uploading) {
        this.setState({showUpload: false, working: true});
        uploading.then(x => {
            Api.addAsset(this.state.selected.id, x.name, x.server_path, x.contenttype).then(x => {
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

    contextClickAction(e, data) {
        if(data.name == "open") {
            this.props.onOpen(this.state.selected.id, data.type, data.label);
        } else if(data.name == "rename") {
            this.setState({renaming: this.state.selected.id, newtype: data.type});
        } else if(data.name == "delete") {
            this.deleteItem(data.type, this.state.selected.id);
        } else if(data.name == "createfolder") {
            this.setState({adding: this.state.selected.id, newtype: "folder"});
        } else if(data.name == "upload") {
            this.setState({showUpload: true});
        } else if(data.name == "properties") {
            this.props.ee.emitEvent("assetproperties", [this.state.selected.id]);
        }
    }

    getContextMenuId(mimetype) {
        if(mimetype == "home") return "assetshome";
        else if(mimetype == "folder") return "assetsfolder";
        else return "assetmenu";
    }

    renderTreeView(items) {
        if(items.length <= 0) return null;
        return(
            <TreeView ref="tree">
                {items.map(x => 
                    <TreeViewItem
                        drop="folder"
                        item={x}
                        id={x.id}
                        type={x.mimetype}
                        published={true}
                        deleted={this.state.deleting == x.id}
                        renaming={this.state.renaming == x.id}
                        adding={this.state.adding == x.id}
                        addicon="folder"
                        onBlur={this.onBlur.bind(this)}
                        onClick={() => this.clickItem(x)}
                        onRename={this.renameItem.bind(this)}
                        onAdd={this.addItem.bind(this)}
                        parentChanged={this.parentChanged.bind(this)}
                        selected={this.state.selected.id == x.id}
                        key={x.id}
                        collapsed={x.collapsed}
                        contextMenuId={this.getContextMenuId(x.mimetype)}
                        onCollapse={(state) => Api.collapseAsset(x.id, state)}
                        label={x.label}>{this.renderTreeView(x.children)}</TreeViewItem> )}
            </TreeView>
        );
    }


    canCreate() {
        return  ["home", "folder"].indexOf(this.state.selectedType) > -1;
    }

    canDelete() {
        return this.state.selectedType.length > 0 && this.state.selectedType != "home";
    }

    renderToolbar() {
        let uploadAction = () => {
            this.setState({showUpload: true})
        };
        let createFolderAction = () => {
            this.setState({adding: this.state.selected.id, newtype: "folder"});
        };
        return(
            <div className="toolbar">
                <SmallToolBar>
                    <SmallToolBarItem disabled={this.canCreate() == false} icon="plus" toggleChildren={true}>
                        <div className="submenu">
                            <nav className="react-contextmenu">
                                {this.canCreate() ? <div onClick={uploadAction.bind(this)} className="react-contextmenu-item">Upload file(s)</div> : null }
                                {this.canCreate() ? <div onClick={createFolderAction.bind(this)} className="react-contextmenu-item">Create folder</div> : null}
                            </nav>
                        </div>
                    </SmallToolBarItem>
                    <SmallToolBarItem disabled={this.canDelete() == false} icon="trash" onClick={this.deleteItem.bind(this)} />
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
                <AssetsContextMenu menuid="assetshome" contextClickAction={this.contextClickAction.bind(this)} />
                <AssetsContextMenu menuid="assetsfolder" contextClickAction={this.contextClickAction.bind(this)} />
                <AssetsContextMenu menuid="assetmenu" contextClickAction={this.contextClickAction.bind(this)} />

                {this.state.working ? this.renderLoading() : null}
                {this.state.showUpload ? <UploadDialog onHide={() => this.setState({showUpload: false})} onUploaded={this.uploaded.bind(this)} /> : null}
            </div>
        )
    }
}