import React from 'react';

export function SmallToolBarItem(props) {
    return (
        <li onClick={props.onClick} className={props.alignright ? "tool-right" : ""}><i className={"fa fa-" + props.icon} aria-hidden="true"></i></li>
    );
}

export class SmallToolBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <ul className="small-toolbar">
                {this.props.children}
            </ul>
        )
    }
}
