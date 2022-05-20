/* ---------------------------------- React --------------------------------- */
import React from 'react'

/* ----------------------------------- MUI ---------------------------------- */
import {Typography, Box, Fab, TableContainer, Table, Paper, TableBody, TableRow, TableCell, CardContent, IconButton, Card } from '@mui/material'

/* -------------------------------- MUI Icons ------------------------------- */
import AddIcon from '@mui/icons-material/Add';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';

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
                                        <Card sx={{ display: 'flex', border: '1px solid #e0e0e0', textDecoration: 'none', boxShadow: 'none', margin: '0.8em 0 0.1em 0'}} >
                                            {/* Sensor title */}
                                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                                            <CardContent sx={{ flex: '1 0 auto' }}>
                                                <Typography component="div" variant="h5" sx={{ textTransform: 'capitalize' }} >
                                                { row.name }
                                                </Typography>
                                                < br />
                                            </CardContent>
                                            </Box>
                                            {/* status */}
                                            <Box style={{ display: 'flex', flexDirection: 'row', margin: '1.2em auto', textTransform: 'capitalize', alignSelf: 'flex-end'}} >
                                                <Typography variant="subtitle2" color="text.secondary" component="div">
                                                { row.status }
                                                </Typography>
                                                <CircleRoundedIcon sx={{fontSize: 20, margin: 'auto', color: 'red', padding: "0 0.45em"}} />
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