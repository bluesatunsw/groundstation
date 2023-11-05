// TargetInfo
// Segment responsible for displaying information about the targeted satellite
// Matt

import { useEffect } from 'react'
import { Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material'

import UTCtoD from '../../../logic/utility'
import { n2yo_radio_passes, n2yo_visual_passes } from '../../../../types/n2yotypes'

interface EncounterInfoProps {
  vp: n2yo_visual_passes
  rp: n2yo_radio_passes
}

const EncounterInfo: React.FC<EncounterInfoProps> = ({ vp, rp }) => {
  let rp_start: string = UTCtoD(rp.startUTC)
  let rp_end: string = UTCtoD(rp.endUTC)
  let rp_max: string = UTCtoD(rp.maxUTC)

  return (
    <div>
      {/* Check if encounter exists. A real one will never have these values */}
      {rp.startAz === rp.endAz && vp.startAz === vp.endAz ? (
        <Grid>
          <Typography variant="h6" component="div">
            Encounter details
          </Typography>
          <Typography variant="body2" textAlign="left">
            No encounter data available. Please select a satellite and trigger an encounter using the Calculate
            Encounter button.
          </Typography>
        </Grid>
      ) : (
        <Grid>
          <Typography variant="h6" component="div">
            Encounter details
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <b>Time window</b>
                  </TableCell>
                  <TableCell>
                    {rp_start} ➜ {rp_end}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ width: '50%' }}>
                    <b>Radio encounter azimuth range</b>
                  </TableCell>
                  <TableCell>
                    ({rp.startAz})° ➜ ({rp.endAz})°
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Zenith</b>
                  </TableCell>
                  <TableCell>
                    {rp.maxEl}° @ {rp_max}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <b>Visual encounter</b>
                  </TableCell>
                  {vp.startAz === vp.endAz ? (
                    <div>
                      <TableCell>No visual</TableCell>
                    </div>
                  ) : (
                    <div>
                      <TableCell>
                        ({vp.startAz}, {vp.startEl})°➜({vp.endAz}, {vp.endEl})°
                      </TableCell>
                    </div>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}
    </div>
  )
}

export default EncounterInfo
