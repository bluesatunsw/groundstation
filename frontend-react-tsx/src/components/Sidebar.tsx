// Sidebar.tsx
// Borrowed from csesoc website, but I did write the first version of it xd
// Matt

import React from 'react'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import { Stack, Typography } from '@mui/material'

const ButtonFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  grid-gap: 50px;
`

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  grid-gap: 30px;
`

interface SideBarButtonProps {
  bgcolor: string
  Color: string
}

const SidebarButton = styled(Button)<SideBarButtonProps>`
  && {
    width: 200px;
    background-color: ${(props) => props.bgcolor};
    color: ${(props) => props.Color};
    border-radius: 15px;
    text-transform: none;
  }
`

interface SideBarProps {
  onFindId: () => void
  onCalcEn: () => void
  setTargetModal: (b: boolean) => void
  setWhatsUpModal: (b: boolean) => void
}

// Wrapper component ${props => props.color}
const SideBar: React.FC<SideBarProps> = ({ setWhatsUpModal, onFindId, onCalcEn, setTargetModal }) => {
  return (
    <Stack direction="row">
      <Typography variant="h4" marginRight="30px">
        Groundstation
      </Typography>
      <ButtonFlex>
        <ButtonGroup>
          <SidebarButton
            variant="contained"
            bgcolor="#4b66a4"
            Color="#ffffff"
            onClick={(e) => {
              setWhatsUpModal(true)
            }}
          >
            What&apos;s up
          </SidebarButton>
          <SidebarButton
            variant="contained"
            bgcolor="#4b66a4"
            Color="#ffffff"
            onClick={(e) => {
              setTargetModal(true)
            }}
          >
            Find by ID
          </SidebarButton>
          <SidebarButton variant="outlined" bgcolor="#06132f" Color="#ffffff" onClick={onCalcEn}>
            Calculate encounter
          </SidebarButton>
        </ButtonGroup>
      </ButtonFlex>
    </Stack>
  )
}

export default SideBar
