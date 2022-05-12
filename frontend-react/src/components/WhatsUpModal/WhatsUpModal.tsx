// // Modal window for selecting a "what's up" entry
// // Matthew Rossouw, @omeh-a (05/2022)
// // # # # 
// // It contains a template selector + preview, as well as a title field.

import { Button, FormControl, Select, MenuItem, InputLabel, 
  Box, Stack, Slider, Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import SatSelector from './SatSelector';
import { categories } from './Category'
import { n2yo_above } from '../../types/n2yotypes';
import { gps_pos } from '../../types/hardwareTypes';
import type { targetSat } from '../../types/targetSat';
import { getWhatsUp } from '../../logic/backend_req';

const Container = styled.div`
  width: 300px;
  height: 350px;
  background: white;
  padding: 10px;
  left: 40%;
  top: 30%;
`

interface WhatsUpProps {
  target: targetSat,
  setTarget: (sat: targetSat) => void,
  location: gps_pos,
  setModalOpen: (open: boolean) => void,
}

// Wrapper component
const WhatsUpModal: React.FC<WhatsUpProps> = ({ target, setTarget, location }) => {

  const [cat, setCat] = React.useState<string>('All')
  const [list, setList] = React.useState<n2yo_above[]>([])
  const [radius, setRadius] = React.useState<number>(20)

  // Currently highlighted template
  const [selected, setSelected] = React.useState<n2yo_above>(
    {
      satid: 0,
      category: "",
      satname: "",
      intDesignator: "",
      launchDate: "",
      satlat: 0,
      satlng: 0,
      satalt: 0
    }
  );

  const aboveToTarget = (sat: n2yo_above) => {

  }

  const queryWhatsUp = async () => {
    let category: number = categories[cat]

    let response = await getWhatsUp(location, radius, category)
    setList(response.above)
  }

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setRadius(newValue as number);
  };


  return (
    <Container>
      <Stack direction={'row'}>
          <Stack style={{marginRight:"20px"}}>
            <FormControl fullWidth>
              <InputLabel id="satellite-category">Search category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={cat}
                label="Cat"
                onChange={(e) => {
                  setCat(e.target.value)
                }}
              >
                {Object.keys(categories).map((key, index) => {
                  return (<MenuItem value={index}>{key}</MenuItem>);
                })}
              </Select>
            </FormControl>
            <Typography gutterBottom>
              Search radius
            </Typography>
            <Slider
              aria-label="Small steps"
              defaultValue={40}
              step={1}
              marks
              min={0}
              max={90}
              valueLabelDisplay="on"
              style={{ marginTop: '40px' }}
              onChange={handleSliderChange}
              sx={{ width: '150px' }}
            />
            <p>
              Warning: Setting search radius above 40 will cause significant slowdown
            </p>
            <Button variant="outlined" color="secondary" onClick={() => {
                queryWhatsUp();
              }}>
                Search
            </Button>
          </Stack>
        <Stack>
          <SatSelector list={list} selected={selected} setSelected={setSelected} />
        </Stack>
      </Stack>
    </Container>

  )
}

export default WhatsUpModal
