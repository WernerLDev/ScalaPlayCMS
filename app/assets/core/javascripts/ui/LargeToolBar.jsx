
import React from 'react';


export default class LargeToolBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="content-toolbar">

                <ul className="large-toolbar">
                    <li><a href="#"><i className="fa fa-life-ring" aria-hidden="true"></i> Publish</a></li>
                    <li><a href="#"><i className="fa fa-floppy-o" aria-hidden="true"></i> Save</a></li>
                    <li><a href="#"><i className="fa fa-gears" aria-hidden="true"></i> Settings</a></li>
                    <li><a href="#"><i className="fa fa-eye" aria-hidden="true"></i> Preview</a></li>
                    <li className="button-right"><a href="#"><i className="fa fa-trash" aria-hidden="true"></i> </a></li>
                </ul>

            </div>
        )
    }
}