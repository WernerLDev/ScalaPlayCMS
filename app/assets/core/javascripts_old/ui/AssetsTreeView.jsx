import React from 'react';
import TreeView from './TreeView.jsx';
import * as Api from '../api/api.js';
import * as TreeActions from '../actions/TreeViewActions.js';
import SmallToolBar from './SmallToolBar.jsx';

export default class AssetsTreeView extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {}
    }

    render() {
        return(
            <div>
                Hier komen de assets.
            </div>
        )
    }

} 