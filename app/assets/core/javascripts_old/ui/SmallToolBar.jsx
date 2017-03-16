import React from 'react';

export default class SmallToolBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(

                <ul className="small-toolbar">
                    <li><i className="fa fa-plus" aria-hidden="true"></i></li>
                    <li><i className="fa fa-trash" aria-hidden="true"></i></li>
                    <li className="tool-right"><i className="fa fa-refresh" aria-hidden="true"></i></li>
                </ul>

        )
    }
}