import React from 'react';
import * as Api from '../../api/api.js';
import Draggable from 'react-draggable';

export default class TextInput extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { editing: false }
    }

    saveInput(e) {
        if(e.keyCode == 13) {
            var newValue = e.currentTarget.value;
            this.setState({editing: false}, () => {
                this.props.onChange(newValue);
            });
        }
    }

    onBlur() {
        this.setState({ editing: false })
    }

    render() {
        if(this.state.editing) {
            return(
                <div>
                    <input autoFocus onBlur={this.onBlur.bind(this)} onKeyUp={this.saveInput.bind(this)} type="text" defaultValue={this.props.value} />
                </div>
            );
        } else {
            return(
                <div>
                {this.props.value} <i onClick={() => this.setState({editing: true})} className="fa fa-pencil" aria-hidden="true"></i>
                </div>
            );
        }
    }
}