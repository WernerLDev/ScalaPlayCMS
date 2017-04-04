import React from 'react';

export class SmallToolBarItem extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { childrenVisible: false }
    }

    toggle() {
        this.setState({ childrenVisible: !this.state.childrenVisible })
    }

    hideChildren() {
        this.setState({ childrenVisible: false })
    }

    render() {
        var classes = [];
        if(this.props.alignright) classes.push("tool-right");
        if(this.props.disabled) classes.push("disabled");

        if(this.props.toggleChildren) {
            return (
                <li 
                    onMouseLeave={this.hideChildren.bind(this)} 
                    onClick={this.toggle.bind(this)}
                    className={classes.join(" ")}>
                        <i className={"fa fa-" + this.props.icon} aria-hidden="true"></i>
                        {this.state.childrenVisible ? this.props.children : null }
                </li>
            );
        } else {
            return (
                <li onClick={this.props.onClick} className={classes}>
                    <i className={"fa fa-" + this.props.icon} aria-hidden="true"></i>
                </li>
            );
        }
    }
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
