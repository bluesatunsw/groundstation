// Scrollable selector for What's Up
// Matthew Rossouw, @omeh-a (09/2021)
// # # # 


import React from 'react';
import styled from 'styled-components';
import SatChip from './SatChip';


interface TemplateFile {
    name: string;
    description: string;
    img: string;
}

interface SatSelectorProps {
    selected: string,
    setSelected : (name: string) => void,
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


/**
 * Subcomponent for NewDialogue which gets a list of
 * templates to present for selection by the user.
 */
const SatSelector : React.FC<SatSelectorProps> = ({selected, setSelected}) => {
    const GetWhatsUp = () => {
    
    }
    return (
        <ScrollDiv>
            {templates["templates"].map((file: TemplateFile)=> {
                return (
                    // eslint-disable-next-line
                    <SatChip name={file.name} isSelected={file.name == selected}
                    img={file.img} description={file.description} click={() => {setSelected(file.name)}}/>
                )                   
            })}
        </ScrollDiv>
    )
}


export default SatSelector
