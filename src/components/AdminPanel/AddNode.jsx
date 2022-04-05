import React, {useEffect, useState} from 'react'
import {Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, styled, TextField, Typography, Snackbar, Alert} from '@mui/material';
import { QrReader } from 'react-qr-reader'
import LoadingOverlay from '../LoadingOverlay';

const Scanner = ({getDeviceId}) => {
    const [data, setData] = useState('');
    const [error, setError] = useState('');
    
    useEffect(() => {
        if (data) {
            console.log(data);
            getDeviceId(data);
        }
    }, [data]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
        >
        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              setData(result?.text);
            }
  
            if (!!error) {
                setError(`error: ${error.e}`);
            }
                }}
                containerStyle={{width: '100%', height: '100%', borderRadius: '1rem'}}
                constraints={{
                    // use back camera
                    facingMode: 'environment',
                    // show camera preview
                    audio: false,
                    // show camera rectangle
                    video: {
                        facingMode: 'environment',
                        width: '100%',
                        height: '100%',
                    },
                }}
          style={{ width: '100%' }}
            />
      </div>
    );
}

const QrContainer = styled("div")`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 30%;
    width: 20%;
    @media (max-width: 600px) {
        height: 100%;
        width: 100%;
    }
    `

function AddNode({t, apiURL}) {

    const [nodeType, setNodeType] = React.useState(''); // the type that is choosen
    const [company, setcompany] = React.useState(''); // the company that is choosen
    const [companies, setCompanies] = React.useState([]); // the companies that are available
    const [isLoading, setIsLoading] = React.useState(false); // is the loading indicator visible
    const [errors, setErrors] = React.useState([]); // the errors that are returned from the server

    // get data from qr code
    const [deviceId, setDeviceId] = React.useState('');
    const [snackBarstatus, setSnackBarstatus] = React.useState(false);
    const [snackBarMessage, setSnackBarMessage] = React.useState('');
    const [snackBarSeverity, setSnackBarSeverity] = React.useState('success');

    // to be able to change the text
    const onUidTextChange = (e) => {
        if (e.target) {
            setDeviceId(e.target.value);
        }
    }

    // handle changing the state of the snack bar
    const handleSnackbarStatus = () => {
        setSnackBarstatus(!snackBarstatus);
    }

    // sets the device id from the qr code
    const getDeviceId = (deviceId) => {
        setDeviceId(deviceId);
        onUidTextChange(deviceId);
    }

    

    const handleNodeTypeChange = (event) => { // when the node type is changed
        setNodeType(event.target.value);
    }
 
    const handleCompanyChange = (event) => { // the company that is choosen
        setcompany(event.target.value); 
    }

    if (companies.length === 0) {
        fetch(`${apiURL}getCompnies?key=${process.env.REACT_APP_TRACT_API_KEY}`)
            .then(res => res.json())
            .then(
                (result) => {
                    setCompanies(result);
                },
                (error) => {
                    console.log(error);
                }
            )
    }
    
    const sendDevice = () => {
        setIsLoading(true);

        fetch(`${apiURL}addNode?key=${process.env.REACT_APP_TRACT_API_KEY}&deviceid=${deviceId}&devicetype=${nodeType}&companyid=${company}`)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    setIsLoading(false);
                    setSnackBarMessage(t('addNodeSuccess'));
                    setSnackBarSeverity('success');
                    setSnackBarstatus(true);
                },
                (error) => {
                    console.log(error);
                    setIsLoading(false);
                    setSnackBarMessage(error.errors);
                    setSnackBarSeverity('error');
                    setErrors(error.errors);
                }
            )
    }

    return (
    <>
            <Snackbar open={snackBarstatus} autoHideDuration={6000} onClose={handleSnackbarStatus}>
                <Alert onClose={handleSnackbarStatus} severity={snackBarSeverity} sx={{ width: '100%' }}>
                {snackBarMessage}
                </Alert>
            </Snackbar>
            
            
        
        <LoadingOverlay loading={isLoading}/>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <QrContainer>
                <Typography variant="h5" style={{
                    textAlign: 'center',
                }} gutterBottom>Scan Qr to add node</Typography>
                <Scanner getDeviceId={getDeviceId}/>
            </QrContainer>
            <div>
                
                <Typography variant="h5" gutterBottom>Node Uid</Typography>
                <TextField
                    id="outlined-basic"
                    label="uid"
                    variant="outlined"
                    value={deviceId}
                    onChange={onUidTextChange}
                    helperText="Scan the QR code or enter the uid manually"
                    style={{
                        marginBottom: '1rem',
                    }}
                />
                
                <Typography variant="h5" gutterBottom>Node sensor type</Typography>
                <FormControl fullWidth>
                    <InputLabel style={{backgroundColor: "white"}} id="node-type">Node type</InputLabel>
                    <Select
                        labelId='node-type'
                        id='node-type'
                        value={nodeType}
                        onChange={handleNodeTypeChange}
                    >
                        <MenuItem value={1}>Temperature and Humidity</MenuItem>
                        <MenuItem value={3}>Switch</MenuItem>
                        <MenuItem value={4}>Analog wheel</MenuItem>
                    </Select>
                </FormControl>
                <br /><br />
                <Typography variant="h5" gutterBottom>Company of node</Typography>
                <FormControl fullWidth>
                    {companies.length > 0 ?
                        <>
                            <InputLabel style={{backgroundColor: "white"}} id='company-id'>Company</InputLabel>
                            <Select
                                labelId='company-id'
                                id='company-id'
                                value={company}
                                onChange={handleCompanyChange}
                            >
                                {companies.map(company => (
                                    <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
                                ))}
                            </Select>
                        </>
                        :
                        <CircularProgress/>
                    }
                </FormControl>
                <Button variant="outlined" color="primary" style={{width: '100%', marginTop: '1rem', marginBottom: '1rem'}} onClick={sendDevice}>
                    {t('addNode')}
                </Button>
            </div>
        </Box>
    </>
    )
}

export default AddNode
