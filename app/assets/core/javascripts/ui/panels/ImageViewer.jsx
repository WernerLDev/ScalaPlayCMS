
import React from 'react';
import * as Api from '../../api/api.js';

export default class ImageViewer extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { asset: null };
    }

    componentDidMount() {
        Api.getAsset(this.props.id).then(asset => {
            this.setState({asset: asset})
        })
    }

    render() {
        if(this.state.asset == null) {
            return(<div id="wrapper">
                    <div className="loading"><img src="/assets/images/rolling.svg" /></div>
                </div>)
        }
        return(
            <div className="imageviewer">
                <img src={"/uploads/" + this.state.asset.name} />
            </div>
        )
    }
}