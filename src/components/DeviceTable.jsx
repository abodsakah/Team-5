/* ---------------------------------- React --------------------------------- */
import React from 'react'

/* ----------------------------------- MUI ---------------------------------- */
import {Typography, Box, Fab, TableContainer, Table, Paper, TableBody, TableRow, TableCell, Card } from '@mui/material'

/* -------------------------------- MUI Icons ------------------------------- */
import AddIcon from '@mui/icons-material/Add';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';


function DeviceTable({devices}) {

    const [anchorEl, setAnchorEl] = React.useState(null);
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <TableContainer component={Paper} style={{boxShadow: 'none', width: '100%'}} >
            <Table size="small" aria-label="a dense table" style={{ borderCollapse:'separate', boxShadow: 'none'}}>
                <TableBody>
                    {devices !== undefined && (
                    <>
                        {devices.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row" style={{border: 'none', padding: '0'}} >
                                        {/* Card */}
                                        <Card sx={{ display: 'flex', border: '1px solid #e0e0e0', textDecoration: 'none', boxShadow: 'none', margin: '0.75em 0 0.1em 0', padding: '0', flexDirection: 'column', }} >
                                            {/* Sensor title */}
                                            <Box sx={{ display: 'flex', flexDirection: 'row', padding: '1em', flexWrap: 'wrap'}}>
                                                <Box sx={{ display: 'flex' }}>
                                                    {row.type == "1" ? 
                                                        < DeviceThermostatIcon sx={{ display: 'flex', marginRight: '0.5em', height: '100%' }}/>
                                                    :
                                                    row.type == "2" ?
                                                        < ToggleOnIcon sx={{ display: 'flex', marginRight: '0.5em', height: '100%' }}/>
                                                        :
                                                        row.type == "3" &&
                                                        < CandlestickChartIcon sx={{  display: 'flex', marginRight: '0.5em', height: '100%' }}/>
                                                    }
                                                    <Typography variant="h5" sx={{ textTransform: 'capitalize', display: 'flex' }}>
                                                        { row.name }
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            {/* status */}
                                            <Box style={{ display: 'flex', justifyContent: 'flex-end', padding: '1em' }} >
                                                <Typography variant="subtitle2" color="text.secondary" component="div" sx={{ flexDirection: 'row', margin: 'auto 0', display: 'flex'}}>
                                                { row.status }
                                                <CircleRoundedIcon sx={{ fontSize: 20, color: 'red', marginLeft: '0.5em'}} />
                                                </Typography>
                                            </Box>
                                        </Card>
                                    </TableCell>
                                </TableRow>
                        ))}
                    </>
                    )}
            </TableBody>
            </Table>
        </TableContainer>
    )
}

export default DeviceTable