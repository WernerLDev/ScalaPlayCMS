
import React from 'react';
import * as Api from '../../api/api.js';
import Modal from './Modal.jsx';

export default class PageSettingsModal extends React.Component {

    constructor(props, context) {
        super(props);
    }

    render() {
        if(this.props.visible == false) return null;
        return (
            <Modal title="Settings" onClose={this.props.onClose}>
                Settings thing
            </Modal>
        )
    }
}