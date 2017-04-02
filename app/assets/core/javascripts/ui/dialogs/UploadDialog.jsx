import React from 'react';
import * as Api from '../../api/api.js';

export default class UploadDialog extends React.Component {

    constructor(props, context) {
        super(props, context);
        
    }

    advancedUpload() {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    };

    onDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("Moving file over here");
        this.refs.uploadbtn.classList.add("fileover");
    }

    onDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("Left with file");
        this.refs.uploadbtn.classList.remove("fileover");
    }

    onDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        var droppedFiles = e.dataTransfer.files;
        console.log("Dropped files");
        console.log(droppedFiles);
        this.refs.uploadbtn.classList.remove("fileover");
        this.doUpload(droppedFiles);
    }

    doUpload(files) {
        [].forEach.call(files, function(file){
            var uploadPromise = Api.uploadAsset(file);
            this.props.onUploaded(uploadPromise); 
        }.bind(this));
    }

    render() {
        return(
            <div>
                <div onClick={this.props.onHide} className="overlay"></div>
                <div className="uploadDialog">
                    <h3>Upload file</h3>
                    <form
                        onDragOver={this.onDragOver.bind(this)}
                        onDragLeave={this.onDragLeave.bind(this)}
                        onDropCapture={this.onDrop.bind(this)}
                    >
                    <label ref="uploadbtn" className="uploadbtn">
                        <input multiple
                            type="file"
                            id="file-select"
                            name="asset[]"
                            onChange={(e) => {
                                var files = e.currentTarget.files;
                                this.doUpload(files);
                            }} />
                            <span><i className="fa fa-upload" aria-hidden="true"></i><br />Select file(s) to upload</span>
                        </label>
                        </form>
                </div>
            </div>
        );
    }
}