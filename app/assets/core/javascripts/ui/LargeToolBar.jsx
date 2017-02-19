
import React from 'react';


export default class LargeToolBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="content-toolbar">

                <ul className="large-toolbar">
                    <li><a href="#" className="myButton"><i className="fa fa-life-ring" aria-hidden="true"></i> Save and publish</a></li>
                    <li><a href="#" className="yellowButton"><i className="fa fa-floppy-o" aria-hidden="true"></i> Save</a></li>
                    <li><a href="#" className="yellowButton"><i className="fa fa-eye" aria-hidden="true"></i> Preview</a></li>
                    <li><a href="#" className="yellowButton"><i className="fa fa-gears" aria-hidden="true"></i> Settings</a></li>
                    <li className="button-right"><a href="#" className="redButton"><i className="fa fa-trash" aria-hidden="true"></i> </a></li>
                </ul>

            </div>
        )
    }
}