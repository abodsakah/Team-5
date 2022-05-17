import * as React from 'react';

import { Link } from 'react-router-dom';
import { useParams  } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import {Card, CardContent, Grid, Typography, Paper} from '@mui/material';
import DeviceTable from './DeviceTable';
import ErrTable from './ErrTable';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import MostFaulty from './MostFaulty';





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

    let mostF = [
        {
            name: 'Sensor 4512-Q4',
            msg:'Total: 23',
        },
        { 
            name: 'Sensor 55654-A13',
            msg:'Total: 15',
        },
        {
            name: 'Sensor 112554-T334',
            msg:'Total: 7',
        },
    ]
        
    

    return (
        <>
        {/* Add sensor Icon */}
        <Box style = {{ position: 'fixed', bottom: 0, right: 0 }} sx={{ fontSize: 25, padding: '1rem', marginBottom: '1rem', '& > :not(style)': { m: 1 } }}>
            <Fab variant="extended" size="large" color="primary"  aria-label="add" component={Link} to={'/devices/add-sensor'} >
            <AddIcon />{t("addSensor")}
            </Fab>
        </Box>
            <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{padding: '1rem'}}>
                        <Typography variant="h4" component="h2">
                            {t('reported')}
                        </Typography>
                        <DeviceTable devices={rows} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={5} style={{padding: '1rem', marginBottom: '1rem'}}>
                        <Typography variant="h4" component="h2">
                            {t('mostFaulty')}
                        </Typography>
                        <MostFaulty mostF={mostF} />
                    </Paper>
                </Grid>
            </Grid>
        </>
    );

}

    export default Index;

