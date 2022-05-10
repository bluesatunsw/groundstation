// Sidebar.tsx
// Borrowed from csesoc website, but I did write the first version of it xd
// Matt

import React from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import Stack from "@mui/material/Stack"
import { gps_pos } from '../types/hardwareTypes';

const Container = styled.div`
  width: 250px;
  background: #ffffff;
  height: 100%;
`

const SidebarTitle = styled.div`
  font-size: x-large;
  margin: 2rem;
  font-weight: bold;
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
  bgColor: string;
}

const SidebarButton = styled(Button) <SideBarButtonProps>`
  && {
    width: 160px;
    /* variant: contained; */
    background-color: ${props => props.bgColor};
    border-radius: 20px;
    text-transform: none;
  }
`

interface SideBarProps {
  onWhatsUp: () => void;
  onFindId: () => void;
  onCalcEn: () => void;
  setModalOpen : (b :boolean) => void;
  location: gps_pos;
}

// Wrapper component ${props => props.color}
const SideBar: React.FC<SideBarProps> = ({ onWhatsUp, onFindId, onCalcEn, setModalOpen, location }) => {
  return (
    <Container>
      <SidebarTitle>
        Groundstation control
      </SidebarTitle>
      <ButtonFlex>
        <ButtonGroup>
          <SidebarButton bgColor="#F88282" onClick={onWhatsUp}>
            What's up
          </SidebarButton>
          <SidebarButton bgColor="#F88282">
            Find by ID
          </SidebarButton>
        </ButtonGroup>
        <ButtonGroup>
          <SidebarButton bgColor="#82A3F8" onClick={onCalcEn}>
            Calculate encounter
          </SidebarButton>
          <SidebarButton bgColor="#82A3F8" onClick={(e) => {setModalOpen(true)}}>
            Set location
          </SidebarButton>
        </ButtonGroup>
      </ButtonFlex>
    </Container>
  )
}

export default SideBar;
