
import React from 'react';
import LargeToolBar from './LargeToolBar.jsx';

export default class TestEditor extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <LargeToolBar />
                {this.props.name}
                {this.props.children}
            </div>
        )
    }
}