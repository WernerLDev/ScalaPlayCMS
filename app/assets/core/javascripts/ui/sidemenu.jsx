import React from 'react';

export default class SideMenu extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return(
            <div className="menuleft">
                <ul>
                    <li>
                        <i className="fa fa-home" aria-hidden="true"></i>
                        <p>Dashboard</p>
                    </li>
                    <li className="active">
                        <i className="fa fa-files-o" aria-hidden="true"></i>
                        <p>Pages</p>
                    </li>
                    <li>
                        <i className="fa fa-cubes" aria-hidden="true"></i>
                        <p>Entities</p>
                    </li>
                    <li>
                        <i className="fa fa-picture-o" aria-hidden="true"></i>
                        <p>Assets</p>
                    </li>
                    <li>
                        <i className="fa fa-gear" aria-hidden="true"></i>
                        <p>Settings</p>
                    </li>
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