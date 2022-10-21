// Sidebar.tsx
// Borrowed from csesoc website, but I did write the first version of it xd
// Matt

import React from 'react';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

const Container = styled.div`
  width: 250px;
  background: #ffffff;
  height: 100%;
`


const ButtonFlex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-gap: 80px;
`

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-gap: 30px;
`

interface SideBarButtonProps {
  bgcolor: string;
  Color: string;
}

const SidebarButton = styled(Button) <SideBarButtonProps>`
  && {
    width: 160px;
    background-color: ${props => props.bgcolor};
    color: ${props => props.Color};
    border-radius: 15px;
    text-transform: none;
  }
`

interface SideBarProps {
  onFindId: () => void;
  onCalcEn: () => void;
  setTargetModal: (b: boolean) => void;
  setWhatsUpModal: (b: boolean) => void;
}

// Wrapper component ${props => props.color}
const SideBar: React.FC<SideBarProps> = ({ setWhatsUpModal, onFindId, onCalcEn, setTargetModal }) => {
  return (
    <Container>
      <Typography variant="h5" margin="15px">
        Groundstation control
      </Typography>
      <ButtonFlex>
        <ButtonGroup>
          <SidebarButton variant="contained" bgcolor="#4b66a4" Color="#ffffff" onClick={(e) => {setWhatsUpModal(true)}}>
            What&apos;s up
          </SidebarButton>
          <SidebarButton variant="contained" bgcolor="#4b66a4" Color="#ffffff" onClick={(e) => { setTargetModal(true) }}>
            Find by ID
          </SidebarButton>
        </ButtonGroup>
        <ButtonGroup>
          <SidebarButton variant="outlined" bgcolor="#06132f" Color="#ffffff" onClick={onCalcEn}>
            Calculate encounter
          </SidebarButton>
        </ButtonGroup>
      </ButtonFlex>
    </Container>
  )
}

export default SideBar;
