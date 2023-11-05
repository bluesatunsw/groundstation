// Monitor tab for tracking info
// Matt Rossouw (omeh-a)
// 10/2022

import {
  // LinearProgress,
  Grid,
  Stack,
  //  TextField,
  Typography,
  Box,
  //  ButtonGroup,
  Button,
} from '@mui/material'
import React from 'react'

interface Props {}

const BackendMonitor: React.FC<Props> = () => {
  // const [progress, setProgress] = React.useState(0);
  // const [buffer, setBuffer] = React.useState(10);

  // const progressRef = React.useRef(() => { });
  // React.useEffect(() => {
  //     progressRef.current = () => {
  //         if (progress > 100) {
  //             setProgress(0);
  //             setBuffer(10);
  //         } else {
  //             const diff = Math.random() * 10;
  //             const diff2 = Math.random() * 10;
  //             setProgress(progress + diff);
  //             setBuffer(progress + diff + diff2);
  //         }
  //     };
  // });

  // React.useEffect(() => {
  //     const timer = setInterval(() => {
  //         progressRef.current();
  //     }, 500);

  // return () => {
  //     clearInterval(timer);
  // };
  // }, []);

  return (
    <Grid>
      <Box sx={{ margin: '15px' }}>
        <Typography variant="body2">Tracking progress</Typography>
        {/* <LinearProgress sx={{margin: "5px"}} variant="buffer" value={progress} valueBuffer={buffer} /> */}
      </Box>
      <Box sx={{ margin: '15px' }}>
        <Stack direction="row" spacing={1}>
          <Typography variant="button">El: 90.0°</Typography>
          <Typography variant="button">Az: 45.0°</Typography>
          <Typography variant="button">MAG: 45.5°</Typography>
          <Typography variant="button">M1 TEMP: 40.7°</Typography>
          <Typography variant="button">M2 TEMP: 43.5°</Typography>
        </Stack>
        <Stack direction="row" sx={{ margin: '15px' }}>
          <Button variant="contained" color="success">
            Start track
          </Button>
          <Button variant="contained" color="error">
            HALT
          </Button>
          <Button variant="contained">Trim</Button>
        </Stack>
      </Box>
    </Grid>
  )
}

export default BackendMonitor
