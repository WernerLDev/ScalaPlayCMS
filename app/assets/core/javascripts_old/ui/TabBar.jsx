import React from 'react';
import Icon from './Icon.jsx';

export default class TabBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="tabsContainer">

                <ul className="tabs">
                    {this.props.tabs.map(tab => (
                        <li key={tab.id} className={tab.active ? "active" : ""}>
                            <div onClick={() => this.props.onTabClick(tab)} className="clickarea"></div>
                            <Icon type={tab.type} /> {tab.name} <i onClick={() => this.props.onTabClose(tab)} className="fa fa-window-close" aria-hidden="true"></i>
                        </li>
                    ) )}
                </ul>

            </div>
        )
    }

}