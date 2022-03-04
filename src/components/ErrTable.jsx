/* ---------------------------------- React --------------------------------- */
import React from 'react'

/* ----------------------------------- MUI ---------------------------------- */
import {Typography, Box, Fab, TableContainer, Table, Paper, TableBody, TableRow, TableCell, CardContent, IconButton, Card } from '@mui/material'

/* -------------------------------- MUI Icons ------------------------------- */
import AddIcon from '@mui/icons-material/Add';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import {height} from '@mui/system';

function ErrTable({errors}) {


    const [anchorEl, setAnchorEl] = React.useState(null);
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <TableContainer component={Paper} style={{boxShadow: 'none'}} >
            <Table size="small" aria-label="a dense table" style={{ borderCollapse:'separate', borderSpacing: '0 0.7em', boxShadow: 'none' }}>
            <TableBody>
                {errors.map((row) => (
                <TableRow key={row.name}>
                    <TableCell component="th" scope="row" style={{ border: 'none', padding: "7px" }} >
                    {/* Card */}
                    <Card sx={{ display: 'flex', border: '1px solid #e0e0e0', textDecoration: 'none', padding: "0 1em", boxShadow:"5px 5px 5px #F0F0F0", height: '7rem'}} >
                        {/* Sensor title */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                        <CardContent sx={{ flex: '1 0 auto', padding: '1em 0', margin: '0' }}>
                            <Typography component="div" variant="h5" sx={{ textTransform: 'capitalize' }} >
                                { row.name }
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary" component="div">
                                {row.dateAndTime}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {row.msg}
                            </Typography>
                        </CardContent>
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

export default ErrTable