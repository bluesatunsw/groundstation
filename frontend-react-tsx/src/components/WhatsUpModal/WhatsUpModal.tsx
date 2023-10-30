// // Modal window for selecting a "what's up" entry
// // Matthew Rossouw, @omeh-a (05/2022)
// // # # # 
// // It contains a template selector + preview, as well as a title field.

import {
  Button, FormControl, Select, MenuItem, InputLabel,
  Stack, Slider, Typography
} from '@mui/material';
import React from 'react';
import styled from '@emotion/styled';
import SatSelector from './SatSelector';
import { categories } from './Category'
import { gps_pos } from '../../../types/hardwareTypes';
import { n2yo_above } from '../../../types/n2yotypes';
import { targetSat } from '../../../types/targetSat';
import { getPositions, getWhatsUp } from '../../logic/backend_req';

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
const WhatsUpModal: React.FC<WhatsUpProps> = ({ target, setTarget, location, setModalOpen }) => {

  const [cat, setCat] = React.useState<string>('0')
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

  // Convert satellite selected from above into target satellite format.
  const aboveToTarget = async () => {
    let response = await getPositions(selected.satid, location, 1)
    let n : targetSat = {
      satid: response.info.satid,
      name: response.info.satname,
      ra: response.positions[0].ra,
      dec: response.positions[0].dec,
      lat: response.positions[0].satlatitude,
      lon: response.positions[0].satlongitude,
      intDesignator: selected.intDesignator,
    };
    setTarget(n)
    setModalOpen(false)
  }

  // Query the backend to get a list of satellites
  const queryWhatsUp = async () => {
    let response = await getWhatsUp(location, radius, parseInt(cat))
    setList([] as n2yo_above[]) // Flush this to avoid issues with caching when switching categories
    setList(response.above)
  }

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setRadius(newValue as number);
  };


  return (
    <Container>
      <Stack direction={'row'}>
        <Stack style={{ marginRight: "20px" }}>
          <FormControl fullWidth>
            <InputLabel id="satellite-category">Search category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={cat}
              label="Category"
              onChange={(e) => {
                setCat(e.target.value)
              }}
            >
              {Object.keys(categories).map((key, index) => {
                return (<MenuItem value={index} key={key}>{key}</MenuItem>);
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
          <Typography variant="caption">
            Warning: If radius is above 40, expect significant slowdown without a category
          </Typography>
          <Button variant="outlined" color="secondary" onClick={() => {
            queryWhatsUp();
          }}>
            Search
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => {
            // open https://www.n2yo.com/satellite/?s=satid in a new window
            window.open(`https://www.n2yo.com/satellite/?s=${selected.satid}`, '_blank')
          }}>
            Show on N2YO
          </Button>
          <Button variant="outlined" style={{ marginTop: "5px" }} onClick={() => {
            aboveToTarget();
          }}>
            Accept
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
