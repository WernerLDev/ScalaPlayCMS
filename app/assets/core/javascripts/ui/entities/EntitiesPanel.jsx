import React from 'react';
import {TreeView, TreeViewItem} from '../uielements/TreeView.jsx';
import * as EntityApi from '../../api/EntityApi.js';
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";
import {SmallToolBar, SmallToolBarItem} from '../toolbars/SmallToolBar.jsx';
import UploadDialog from '../dialogs/UploadDialog.jsx';

export default class EntitiesPanel extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { entities: [], items: [], working: true, selected: -1 };
    }

    componentDidMount() {
        var newid = 0;
        EntityApi.getEntities().then(entities => {
            var tree = entities.map(entity => {
                return EntityApi.getInstancesOf(entity.name).then(instances => {
                    var newinstances = instances.map(i => {
                        var newi = i; 
                        newi.children = [];
                        newi.objtype = "cube";
                        return newi;
                    } );
                    return {
                        id: ++newid, name: entity.name, objtype: "cubes", children: newinstances
                    }
                });
            })
            Promise.all(tree).then(t => {
                console.log(t);
                this.setState({entities: entities, items: t, working: false});
            })
        })
    }

    deleteItem() {
        console.log("Not implemented yet")
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

    rrrrenderTreeView() {
        return(
            <div>
                 {this.state.entities.map(x => <div key={x.name}>{x.name}</div>)}
            </div>
        )
    }

    onBlur() {

    }

    clickItem(x) {

    }

    renameItem() {

    }

    addItem() {

    }

    parentChanged() {

    }

    renderTreeView(items) {
        if(items.length <= 0) return null;
        return(
            <TreeView>
                {items.map(x => 
                    <TreeViewItem
                        drop="none"
                        item={x}
                        id={x.id}
                        type={x.objtype}
                        published={true}
                        deleted={false}
                        renaming={false}
                        adding={false}
                        addicon="folder"
                        onBlur={this.onBlur.bind(this)}
                        onClick={() => this.clickItem(x)}
                        onRename={this.renameItem.bind(this)}
                        onAdd={this.addItem.bind(this)}
                        parentChanged={this.parentChanged.bind(this)}
                        selected={false}
                        key={x.id + x.name}
                        collapsed={true}
                        contextMenuId={"test"}
                        onCollapse={(state) => console.log("asdf")}
                        label={x.name}>{this.renderTreeView(x.children)}</TreeViewItem> )}
            </TreeView>
        );
    }


    renderLoading() {
        return(
             <div className="loading"><img src="/assets/images/rolling.svg" alt="" /> </div>
        )
    }

    render() {
        if(this.state.entities.length <= 0){
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
                    {this.renderTreeView(this.state.items)}
                </div>
                {this.state.working ? this.renderLoading() : null}
            </div>
        )
    }
}