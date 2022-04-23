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
                {devices.map((row) => (
                <TableRow>
                    <TableCell component="th" scope="row" style={{ border: 'none', padding: "7px" }} >
                    {/* Card */}
                    <Card sx={{ display: 'flex', border: '1px solid #e0e0e0', textDecoration: 'none', padding: "0 1em", boxShadow:"none" }} >
                        {/* Sensor title */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                        <CardContent sx={{ flex: '1 0 auto', padding: '1em 0' }}>
                            <Typography component="div" variant="h5" sx={{ textTransform: 'capitalize' }} >
                            { row.name }
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                            Lite info <b>{ row.installed }</b>
                            </Typography>
                        </CardContent>
                        </Box>
                        {/* Icons more/status */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', margin: 'auto',  gap: '1em', alignItems:"flex-start"}}>
                        <IconButton title={ row.name } variant="contained" onClick={handleClick} sx={{ width: "fit-content", alignSelf: 'flex-end' }}>
                            <MoreVertRoundedIcon />
                        </IconButton>
                        <Box style={{ display: 'flex', flexDirection: 'row', margin: '0 auto', textTransform: 'capitalize', alignSelf: 'flex-end'}} >
                            <Typography variant="subtitle2" color="text.secondary" component="div">
                            { row.status }
                            </Typography>
                            <CircleRoundedIcon sx={{ fontSize: 20, margin: 'auto', color: 'red', padding:"0 0.45em" }}></CircleRoundedIcon>
                        </Box>
                        </Box>
                    </Card>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
    )
}

export default DeviceTable