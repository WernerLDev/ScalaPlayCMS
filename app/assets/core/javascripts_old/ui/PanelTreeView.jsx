import React from 'react';
import TreeView from './TreeView.jsx';
import * as Api from '../api/api.js';
import * as TreeActions from '../actions/TreeViewActions.js';
import SmallToolBar from './SmallToolBar.jsx';

export default class PanelTreeView extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { items: [], pagetypes: []}
    } 

    getData() {
        return Api.getDocuments().then(data => {
            this.setState({items: data, pagetypes: this.state.pagetypes});
        });
    }

    componentDidMount() {
        Api.getPageTypes().then(types => {
            this.setState({items: [], pagetypes: types.pagetypes})
            this.getData();
        })
    }

    clickHandler(prop, action) {
        if(action == "collapse") {
            Api.collapseDocument(prop.id, !prop.collapsed);
            this.setState({ items: TreeActions.collapseTree(prop, this.state.items) })
        } else if(action == "select") {
            this.setState({items: TreeActions.selectItem(prop, this.state.items) });
        } else if(action == "dblclick") {
            this.props.dblclick(prop);
        } else if(action == "delete") {
            Api.deleteDocument(prop.id).then(data => {
                this.getData();
                this.props.deleteItem(prop.id);
            })
        } else if(action == "newitemadded") {
            this.getData().then(x => {
                this.setState({items: TreeActions.selectItem(prop, this.state.items) });
                this.props.dblclick(prop); 
            });
        } else if(action == "refresh") {
            this.getData();
            this.props.renameItem(prop.id, prop.name)
        } else if(action == "updateparent") {
            Api.updateParentDocument(prop.id, prop.parent_id).then(r => {
                this.getData();
            });
        }
    }

    render() {
        if(this.state.items.length <= 0) {
            return(
                <div className="panel-treeview">
                    <div className="loading">
                        <img src="/assets/images/ring.svg" />
                    </div>
                </div>
            )
        }
        return(
            <div className="panel-treeview">
                <div className="toolbar">
                    <SmallToolBar />
                </div>
                    <div className="tree">
                         {this.state.items.map(x => <TreeView pagetypes={this.state.pagetypes} id={x.id} selected={x.selected} type={x.doctype} label={x.label} key={x.id} callback={this.clickHandler.bind(this)} collapsed={x.collapsed} children={x.children} />  )}
                    </div>
            </div>
        )
    }

}

//export default DragDropContext(HTML5Backend)(PanelTreeView);


export const ItemTypes = {
  FILE: 'file'
};