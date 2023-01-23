// TargetInfo
// Segment responsible for displaying information about the targeted satellite
// Matt

import React from 'react';
import type { targetSat } from '../../../types/targetSat';
import { Grid, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

interface TargetInfoProps {
    sat: targetSat
}

const TargetInfo: React.FC<TargetInfoProps> = ({ sat }) => {
    return (
        <Grid sx={{ minWidth: 270 }}>
            <Typography variant="h6" component="div">
                {sat.name}
            </Typography>
            <TableContainer>
                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <b>
                                    NORAD ID
                                </b>
                            </TableCell>
                            <TableCell align="right">{sat.satid}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <b>
                                    Intl. designator
                                </b>
                            </TableCell>
                            <TableCell align="right">{sat.intDesignator}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <b>
                                    Right ascention
                                </b>
                            </TableCell>
                            <TableCell align="right">{sat.ra}°</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <b>
                                    Declination
                                </b>
                            </TableCell>
                            <TableCell align="right">{sat.dec}°</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <b>
                                    Longitudinal base
                                </b>
                            </TableCell>
                            <TableCell align="right">{sat.lon}°</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <b>
                                    Latitudinal base
                                </b>
                            </TableCell>
                            <TableCell align="right">{sat.lat}°</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}

export default TargetInfo;