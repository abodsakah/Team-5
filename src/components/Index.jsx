import * as React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams  } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import {Card, CardContent, Grid, Typography, Paper, CircularProgress} from '@mui/material';
import DeviceTable from './DeviceTable';
import ErrTable from './ErrTable';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import MostFaulty from './MostFaulty';
import axios from 'axios';





const Index = ({t, apiURL, user}) => {

    const [reportedDevicesLoading, setReportedDevicesLoading] = React.useState(true);
    const [reportedDevices, setReportedDevices] = React.useState([]);

    let mostF = [
        {
            name: 'Glödlampa ikea 121-T ',
            msg:'Total: 23',
        },
        { 
            name: 'Temp Sensor 55654-A13',
            msg:'Total: 15',
        },
        {
            name: 'Dörr Sensor 4512-Q4',
            msg:'Total: 7',
        },
    ]
        
    const getReportedDevices = () => {
        setReportedDevicesLoading(true);
        setReportedDevices([]);
        axios.get(`${apiURL}/getReportedLogicalDeviceForCompany?key=${process.env.REACT_APP_TRACT_API_KEY}&companyId=${user.company_id}`).then(res => {
            // convert object of objects to array of objects

            let rdArray = Object.keys(res.data).map(function(k) { return res.data[k] });
            setReportedDevices(rdArray);
            setReportedDevicesLoading(false);
        }).catch(err => {
            alert(err.message)
        });
    }

    useEffect(() => {
        getReportedDevices();
    }, []);

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
                            {t('reported')} ({ reportedDevices.length })
                        </Typography>
                        < br />
                        {reportedDevicesLoading ? <CircularProgress /> : 
                            reportedDevices.length > 0 ? <DeviceTable devices={reportedDevices} /> : <Typography variant="h5">{t('noReportedDevices')}</Typography>
                        }
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={5} style={{padding: '1rem', marginBottom: '1rem'}}>
                        <Typography variant="h4" component="h2">
                            {t('mostFaulty')}
                        </Typography>
                        < br />
                        <MostFaulty mostF={mostF} />
                    </Paper>
                </Grid>
            </Grid>
        </>
    );

}

    export default Index;

