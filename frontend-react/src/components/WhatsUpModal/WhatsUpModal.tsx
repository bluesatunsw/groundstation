// // Modal window for selecting a "what's up" entry
// // Matthew Rossouw, @omeh-a (05/2022)
// // # # # 
// // It contains a template selector + preview, as well as a title field.

import { Button, TextField } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import SatSelector from './SatSelector';


const Container = styled.div`
  width: 300px;
  height: 350px;
  background: white;
  padding: 10px;
  left: 40%;
  top: 30%;
`

const Body = styled.div`
  display: flex;
  flex-direction: row; 
  height: 50%;
`

// Temporary placeholder until we implement the selector element
const TemplatePreview = styled.div`
  display: flex;
  width: 30%;
  background: #e7e1e1;
  margin: 15px;
`

interface WhatsUpProps {
  location: string;
}

// Wrapper component
const WhatsUpModal: React.FC<WhatsUpProps> = ({location: location}) => {
  
  
  // Input box state
  const [title, setTitle] = React.useState("untitled");

  // Currently highlighted template
  const [selected, setSelected] = React.useState("");

  return (
    
    <Container>
      <div style={{paddingLeft:"15px"}}>
        {(<p>Location {location}</p>)}
      </div>
      <Body>
        <SatSelector selected={selected} setSelected={setSelected}/>
        <TemplatePreview>
          (preview)
        </TemplatePreview>
      </Body>
      <div style = {{margin: "auto", width: "40%", padding:"15px"}}>
        <Button variant="outlined" color="secondary" onClick={() => {
          // TODO: add logic for spawning new doc + redirect to editor
          alert(`clicked`)
        }}>
          New page
        </Button>
      </div>
    </Container>

  )
}

export default WhatsUpModal
