
import React from 'react';
import * as Api from '../../../api/api.js';
import Draggable from 'react-draggable';
import Datetime from 'react-datetime';
import moment from 'moment';

export default class TextInput extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { editing: false, savedDate: new Date() }
    }

    saveInput(e) {
        this.setState({editing: false}, () => {
            this.props.onChange(this.state.savedDate);
        });
    }

    saveDate(date) {
        this.setState({ savedDate: date._d});
    }

    onBlur() {
        this.setState({ editing: false })
    }

    render() {
        if(this.state.editing) {
            return (
                <div>
                    {this.props.value.toLocaleFormat()}
                    <i onClick={() => this.setState({editing: !this.state.editing})} className="fa fa-pencil" aria-hidden="true"></i>
                    <i onClick={this.saveInput.bind(this)} className="fa fa-floppy-o" aria-hidden="true"></i>
                    <Datetime onBlur={this.onBlur.bind(this)} onChange={this.saveDate.bind(this)} defaultValue={this.props.value} input={false} />
                </div>
            )
        }
        return(
            <div>
            {moment(this.props.value).format("MMMM Do YYYY, HH:MM")} <i onClick={() => this.setState({editing: !this.state.editing, savedDate: this.props.value})} className="fa fa-pencil" aria-hidden="true"></i>
            </div>
        );
    }
}