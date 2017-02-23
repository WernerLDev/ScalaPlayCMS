
import React from 'react';
import LargeToolBar from './LargeToolBar.jsx';
import SplitPane from 'react-split-pane';

export default class TestEditor extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <LargeToolBar />
                 <SplitPane split="vertical" minSize={50} defaultSize={100}>
                    <div>

                    </div>
                    <div>
                        {this.props.name}
                        {this.props.children}
                    </div>
                </SplitPane>
            </div>
        )
    }
}