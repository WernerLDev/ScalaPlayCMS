import React from 'react';
import * as Api from '../../api/api.js';
import Draggable from 'react-draggable';

export default class Modal extends React.Component {

    constructor(props, context) {
        super(props, context);
        
    }

    closeModal() {
        this.props.onClose();
    }

    render() {
        return(
            <div>
                <div className="modal-back"></div>
                <Draggable handle=".modal-head">
                    <div className="modal">
                        <div className="modal-head">
                            {this.props.title}
                            <div className="closebtn" onClick={this.closeModal.bind(this)}><i className="fa fa-times" aria-hidden="true"></i></div>
                        </div>
                        <div className="modal-content">
                            {this.props.children}
                        </div>
                    </div>
                </Draggable>
            </div>
        )
    }
}