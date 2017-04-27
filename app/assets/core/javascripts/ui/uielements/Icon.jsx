import React from 'react';

export default function Icon(props) {

    if(props.type == "arrow-down") {
        return (
            <i onClick={props.onClick} className="fa fa-minus-square-o arrow" aria-hidden="true"></i>
        )
    } else if(props.type == "arrow-right") {
       return (
            <i onClick={props.onClick} className="fa fa-plus-square-o arrow" aria-hidden="true"></i>
       )
    } else if(props.type == "page") {
       return (
            <i className="fa fa-file-code-o fileicon" aria-hidden="true"></i>
       )
    } else if(props.type == "folder") {
       return (
            <i className="fa fa-folder fileicon" aria-hidden="true"></i>
       )
    } else if(props.type == "folder-open"){
       return (
            <i className="fa fa-folder-open fileicon" aria-hidden="true"></i>
       )
    } 
    else if(props.type == "picture" || props.type.startsWith("image")) {
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
    } else if(props.type == "application/pdf") {
        return (
            <i className="fa fa-file-pdf-o" aria-hidden="true"></i>
        )
    } else if(props.type.startsWith("application") && (props.type.match("officedocument") != null || props.type.match("opendocument") != null) ) {
        return (
            <i className="fa fa-file-word-o" aria-hidden="true"></i>
        )
    } else if(props.type.startsWith("text")) {
       return (
            <i className="fa fa-file-text-o" aria-hidden="true"></i>
        ) 
    }
    else if(props.type == "cubes") {
        return (
            <i className="fa fa-cubes" aria-hidden="true"></i>
        )
    }
    else if(props.type == "cube") {
        return (
            <i className="fa fa-cube" aria-hidden="true"></i>
        )
    }
    else {
       return (
            <i className="fa emptyicon fileicon" aria-hidden="true"></i>
       )
    }
}