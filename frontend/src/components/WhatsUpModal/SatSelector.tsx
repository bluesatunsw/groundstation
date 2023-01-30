// Scrollable selector for What's Up
// Matthew Rossouw, @omeh-a (05/2022)
// # # # 


import React from 'react';
import styled from '@emotion/styled';
import { n2yo_above } from '../../types/n2yotypes';
import SatChip from './SatChip';



interface SatSelectorProps {
    selected: n2yo_above,
    list: n2yo_above[],
    setSelected: (sat: n2yo_above) => void,
}

const ScrollDiv = styled.div`
    overflow-y:scroll;
    word-break: break-all;
    flex-wrap: wrap;
    display: flex;
    width: 70%;
    background: #f1f1f1;
    margin: 10px;
`

const SatSelector: React.FC<SatSelectorProps> = ({ list, selected, setSelected }) => {
    
    return (
        <div>
            <p style={{paddingLeft:"10px"}}>
                {list.length} satellites found
            </p>
            <ScrollDiv style={{width : "300px"}}>
                {list.map((sat: n2yo_above) => {
                    return (
                        <SatChip isSelected={sat === selected} sat={sat} key={sat.satid}
                            setSelected={() => { setSelected(sat) }} />
                    )
                })}
            </ScrollDiv>    
        </div>
    )
}


export default SatSelector
