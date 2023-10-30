// Individul chip representing a Whats Up response
// Matthew Rossouw, @omeh-a (05/2022)
// # # # 
// Renders a MaterialUI chip for the satellite. A material UI tooltip contains
// the description for the template.


import { Avatar, Chip, Tooltip } from '@mui/material';
import React from 'react';
import { deepOrange, green } from '@mui/material/colors';
import { n2yo_above } from '../../../types/n2yotypes';

interface SatChipProps {
    sat : n2yo_above,
    isSelected: boolean,
    setSelected: (sat : n2yo_above) => void
}

/**
 * Representation of a single template. Returns its name to the Selector
 * upon click to let it know which one is selected.
 */
const SatChip : React.FC<SatChipProps> = ({sat, setSelected, isSelected}) => {
    return (
        <Tooltip title = {sat.satid}>
            {sat.satname.includes("DEB") ? 
            // Satellite
            <Chip
                label = {`${sat.satname} : ${sat.intDesignator}`}
                avatar = {<Avatar sx={{ bgcolor: deepOrange[500] }}>!</Avatar>}
                onClick = {() => {setSelected(sat)}}
                color = {isSelected ? "primary" : "default"}
                style = {{margin: "3px", width: "340px", justifyContent: "left"}}
            /> : 
            // Debris
            <Chip 
                label = {`${sat.satname} : ${sat.intDesignator}`}
                avatar = {<Avatar sx={{ bgcolor: green[500] }}>{sat.satname.substring(0,1)}</Avatar>}
                onClick = {() => {setSelected(sat)}}
                color = {isSelected ? "primary" : "default"}
                style = {{margin: "3px", width: "340px", justifyContent: "left"}}/>}
        </Tooltip>
    )
}


export default SatChip
export{}