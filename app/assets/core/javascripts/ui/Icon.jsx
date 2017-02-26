import React from 'react';

export default function Icon(props) {

    if(props.type == "arrow-down") {
        return (
            <i onClick={props.click} className="fa fa-minus-square-o arrow" aria-hidden="true"></i>
        )
    } else if(props.type == "arrow-right") {
       return (
            <i onClick={props.click} className="fa fa-plus-square-o arrow" aria-hidden="true"></i>
       )
    } else if(props.type == "file") {
       return (
            <i className="fa fa-file-code-o fileicon" aria-hidden="true"></i>
       )
    } else if(props.type == "folder") {
       return (
            <i className="fa fa-folder-o fileicon" aria-hidden="true"></i>
       )
    } else if(props.type == "picture") {
       return (
            <i className="fa fa-file-image-o fileicon" aria-hidden="true"></i>
       )
    } else if(props.type == "home") {
       return (
            <i className="fa fa-home fileicon" aria-hidden="true"></i>
       )
    } else if(props.type == "plus") {
        return(
            <i className="fa fa-plus" aria-hidden="true"></i>
        )
    } else if(props.type == "trash") {
        return (
            <i className="fa fa-trash" aria-hidden="true"></i>
        )
    } else if(props.type == "pencil") {
        return (
            <i className="fa fa-pencil" aria-hidden="true"></i>
        )
    }
    else {
       return (
            <i className="fa emptyicon fileicon" aria-hidden="true"></i>
       )
    }
}