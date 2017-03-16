import React from 'react';

export function SideMenuItem(props) {
    return(
        <li className={props.active ? "active" : ""} onClick={props.onClick}>
            <i className={"fa fa-" + props.icon} aria-hidden="true"></i>
            <p>{props.children}</p>
        </li>

    )
}

export class SideMenu extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return(
            <div className="menuleft">
                <ul>
                    {this.props.children}
                    <li className="signoutbtn">
                        <a href="/admin/logout">
                        <i className="fa fa-sign-out" aria-hidden="true"></i>
                        <p>Logout</p>
                        </a>
                    </li>
                </ul>
            </div>
        )
    }

}