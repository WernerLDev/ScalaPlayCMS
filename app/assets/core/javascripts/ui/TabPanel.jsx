import React from 'react';
import TabBar from './TabBar.jsx';

export default class TabPanel extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        var active = this.props.tabs.filter(x => x.active);
        active = active.length > 0 ? active[0] : this.props.tabs[0];
        return(
            <div>
                <TabBar onTabClick={this.props.clickTab} onTabClose={this.props.closeTab} tabs={this.props.tabs} />
                {active ? active.content : ""}
            </div>
        )
    }

}