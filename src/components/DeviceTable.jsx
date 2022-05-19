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
        <TableContainer component={Paper} style={{boxShadow: 'none'}} >
            <Table size="small" aria-label="a dense table" style={{ borderCollapse:'separate', borderSpacing: '0 0.7em', boxShadow: 'none' }}>
                <TableBody>
                    {devices !== undefined && (
                    <>
                        {devices.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row" style={{border: 'none', padding: "7px"}} >
                                        {/* Card */}
                                        <Card sx={{display: 'flex', border: '1px solid #e0e0e0', textDecoration: 'none', padding: "0 1em", boxShadow: "none"}} >
                                            {/* Sensor title */}
                                            <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', alignContent: 'center'}}>
                                                <CardContent sx={{padding: '1em 0', display: 'flex', alignContent: 'center'}}>
                                                    <Typography component="div" variant="h5" sx={{textTransform: 'capitalize', padding: '0'}} >
                                                        {row.name}
                                                    </Typography>
                                                </CardContent>
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