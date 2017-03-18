import React from 'react';
import * as Api from '../../api/api.js';

export default class UploadDialog extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return(
            <div>
                <div className="overlay"></div>
                <div className="uploadDialog">
                    <h3>Upload file</h3>
                    <input ref="fileselect" type="file" id="file-select" name="asset" />
                    <button type="submit" id="upload-button" onClick={() => {
                        var file = this.refs.fileselect.files[0];
                        var uploadPromise = Api.uploadAsset(file)
                        this.props.onUploaded(uploadPromise);
                    }}>Upload</button>
                </div>
            </div>
        );
    }
}