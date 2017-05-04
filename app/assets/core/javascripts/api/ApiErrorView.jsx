import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Modal from '../ui/dialogs/Modal.jsx';

class ApiErrorView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
        <Modal title={"Error " + this.props.errorCode + " : " + this.props.statusText} onClose={this.props.onClose}>
            <h1>Oops, something went wrong.</h1>
           {this.props.body} 
        </Modal> 
    )
  }
}

ApiErrorView.PropTypes = {
    errorCode : PropTypes.number,
    statusText : PropTypes.string,
    body: PropTypes.string,
    onClose: PropTypes.func
}



export default function ApiError(code, status, body) {
    let onClose = function() {
        document.getElementById("errordiv").innerHTML = "";
    }
    ReactDOM.render(
        <ApiErrorView errorCode={code} statusText={status} body={body} onClose={onClose} />,
        document.getElementById('errordiv')
    );
}