
import React from 'react';
import LargeToolBar from './LargeToolBar.jsx';
import SplitPane from 'react-split-pane';

export default class TestEditor extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div id="wrapper">
                <LargeToolBar />
                <div className="iframe-wrapper">
                    <iframe src="/" />
                </div>
            </div>
        )
    }
}