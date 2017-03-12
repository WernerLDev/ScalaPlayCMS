
import React from 'react';


export class LargeToolBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="content-toolbar">

                <ul className="large-toolbar">
                    {this.props.children}
                </ul>

            </div>
        )
    }
}

export function ToolbarItemLarge(props) {
    return (
        <li className={props.classes ? props.classes : ""}><a onClick={props.clicked} href="#"><i className={"fa fa-" + props.icon} aria-hidden="true"></i> {props.label}</a></li>
    )
}