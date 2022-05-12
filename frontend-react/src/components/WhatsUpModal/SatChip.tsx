// Individul chip representing a Whats Up response
// Matthew Rossouw, @omeh-a (05/2022)
// # # # 
// Renders a MaterialUI chip for the satellite. A material UI tooltip contains
// the description for the template.


import { Avatar, Chip, Tooltip } from '@mui/material';
import React from 'react';


interface SatChipProps {
    name : string,
    satid : number,
    isSelected: boolean,
    category: string,
    click: (id : number) => void
}

/**
 * Representation of a single template. Returns its name to the Selector
 * upon click to let it know which one is selected.
 */
const SatChip : React.FC<SatChipProps> = ({name, satid, click, isSelected}) => {
    return (
        <Tooltip title = {description}>
            <Chip
                id = {name}
                label = {name}
                avatar = {<Avatar>{name.substring(0,1)}</Avatar>}
                onClick = {() => {click(name)}}
                color = {isSelected ? "primary" : "default"}
                style = {{margin: "3px"}}
            />

        </Tooltip>
    )
}


export default SatChip
export{}