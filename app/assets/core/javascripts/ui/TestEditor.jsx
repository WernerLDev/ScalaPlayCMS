
import React from 'react';
import LargeToolBar from './LargeToolBar.jsx';
import SplitPane from 'react-split-pane';
import * as Api from '../api/api.js';

export default class TestEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = { document: null };
    }

    componentDidMount() {
        Api.getDocument(this.props.docid).then(document => {
            this.setState({ document: document });
        })
    }

    render() {
        if(this.state.document == null) {
            return(<div id="wrapper">
                <LargeToolBar />
                Loading document...
                </div>)
        }
        return(
            <div id="wrapper">
                <LargeToolBar />
                <div className="iframe-wrapper">
                    <iframe src={this.state.document.path} />
                </div>
            </div>
        )
    }
}