import React from 'react';
import Icon from '../Icon.jsx';

function Tab(props) {
    return(
        <li className={props.active ? "active" : ""}>
            <div className="clickarea"></div>
            <Icon type="file" /> {props.label} <i className="fa fa-window-close" aria-hidden="true"></i>
        </li>
    )
}


export default class TabPanel extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return(
            <div className="tabsContainer">

                <ul className="tabs">
                    <Tab active={false} label="test" />
                    <Tab active={true} label="nogeen" />
                    <Tab active={false} label="bladiebla" />
                </ul>

            </div>
        )
    }
}