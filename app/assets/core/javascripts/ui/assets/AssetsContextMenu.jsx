import React from 'react';
import { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from "react-contextmenu";

export default function AssetsContextMenu(props) {
    const menuid = props.menuid;

    let canCreate = (type) => { return type == "assetsfolder" || type == "assetshome"; }

    let addsubmenu = (
        <SubMenu hoverDelay={0} title="Add...">
                <MenuItem onClick={props.contextClickAction} data={{name: 'upload'}}>Upload file(s)</MenuItem>
                <MenuItem onClick={props.contextClickAction} data={{name: 'createfolder'}}>Folder</MenuItem>
        </SubMenu>
    );
    return(
        <ContextMenu id={String(menuid)}>
            {canCreate(menuid) ? addsubmenu : null }
            <MenuItem onClick={props.contextClickAction} data={{name: 'open'}}>Open</MenuItem>
            {menuid != "assetshome" ? <MenuItem onClick={props.contextClickAction} data={{name: 'rename'}}>Rename</MenuItem> : null}
            {menuid != "assetshome" ? <MenuItem onClick={props.contextClickAction} data={{name: 'delete'}}>Delete</MenuItem> : null}
            <MenuItem onClick={props.contextClickAction} data={{name: 'rename'}}>Settings</MenuItem>
        </ContextMenu>
    )
}