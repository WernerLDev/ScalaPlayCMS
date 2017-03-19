import React from 'react';
import * as Api from '../../api/api.js';

export default class UploadDialog extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return(
            <div>
                <div onClick={this.props.onHide} className="overlay"></div>
                <div className="uploadDialog">
                    <h3>Upload file</h3>
                    <label className="uploadbtn">
                        <input multiple
                            type="file"
                            id="file-select"
                            name="asset"
                            onChange={(e) => {
                                var files = e.currentTarget.files;
                                [].forEach.call(files, function(file){
                                    var uploadPromise = Api.uploadAsset(file);
                                    this.props.onUploaded(uploadPromise);  
                                }.bind(this))
                            }} />
                            <span>Select one or more files</span>
                        </label>
                </div>
            </div>
        );
    }
}