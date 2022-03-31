import * as React from 'react';

import { Link } from 'react-router-dom';
import { useParams  } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import {Card, CardContent, Grid, Typography, Paper} from '@mui/material';
import DeviceTable from './DeviceTable';
import ErrTable from './ErrTable';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';





const Index = ({text, cookies, t}) => {

    // Tablecontent
    function createData(name, calories, status, carbs, protein) {
        return { name, calories, status, carbs, protein };
    }

    let rows = [
        createData('hiss Entré 1', 18, 'status', 24, 4.0),
        createData('temperatursensor 3', 18, 'status', 24, 4.0),
        createData('dörr 3', 237, 'status', 37, 4.3),
    ]

    let errors = [
        {
            name: 'hiss Entré 1',
            msg: 'Error 1',
            status: 'error',
            dateAndTime: '2020-01-01 12:00:00'
        },
        {
            name: 'hiss Entré 2',
            msg: 'Error 2',
            status: 'Warning',
            dateAndTime: '2020-01-01 12:00:00'
        },
        {
            name: 'hiss Entré 3',
            msg: 'Error 3',
            status: 'error',
            dateAndTime: '2020-01-01 12:00:00'
        },
    ]
        
    

    return (
        <>
        {/* Add sensor Icon */}
        <Box style = {{ position: 'fixed', bottom: 0, right: 0 }} sx={{ '& > :not(style)': { m: 3 } }}>
            <Fab size="large" color="primary" aria-label="add" component={Link} to={'/devices/add-sensor'} >
            <AddIcon />
            </Fab>
        </Box>
            <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{padding: '1rem'}}>
                        <Typography variant="h3" component="h2">
                            {t('failing')}
                        </Typography>
                        <DeviceTable devices={rows} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={4} style={{padding: '1rem', marginBottom: '1rem'}}>
                        <Typography variant="h3" component="h2">
                            {t('errMessages')}
                        </Typography>
                        <ErrTable errors={errors} />
                    </Paper>
                </Grid>
            </Grid>
        </>
    );

}

    export default Index;

