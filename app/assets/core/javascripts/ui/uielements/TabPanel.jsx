import React from 'react';
import Icon from './Icon.jsx';

export function Tab(props) {
    var closebtn = null;
    if(props.closable) {
        closebtn = (<i onClick={() => props.onClose(props.id)} className="fa fa-window-close" aria-hidden="true"></i>);
    }
    return(
        <li className={props.active == props.id ? "active" : ""}>
            <div onClick={() => props.onClick(props.id)} className="clickarea"></div>
            <Icon type={props.type} /> {props.label} {closebtn}
        </li>
    )
}

export function TabsList(props) {

    return(
        <div className="tabsContainer">
            <ul className="tabs">
                {props.children.map(t => React.cloneElement(t, { active: props.active, closable: props.closable, onClick: props.onClick, onClose: props.onClose }))}
            </ul>
        </div>
    );
}

export function TabContent(props) {

    return(
        <div className={props.active ? "visible" : "hidden"}>
            {props.children}
        </div>
    )

}
