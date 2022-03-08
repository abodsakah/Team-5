import React, {useState} from 'react'
import {Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, styled, TextField, Typography} from '@mui/material';
import { QrReader } from 'react-qr-reader'

const Scanner = ({getDeviceId}) => {
    const [data, setData] = useState('No result');
    const [error, setError] = useState('');
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
                console.log(error);
            }
                }}
                containerStyle={{width: '100%', height: '100%', borderRadius: '1rem'}}
                cameraStyle={{width: '100%', height: '100%', borderRadius: '1rem'}}
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
            <p>{error != '' && error}</p>
        <p>{data}</p>
      </div>
    );
}

const QrContainer = styled("div")`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 30%;
    width: 30%;
    @media (max-width: 600px) {
        height: 100%;
        width: 100%;
    }
    `

function AddNode({t, apiURL}) {

    const [nodeType, setNodeType] = React.useState(''); // the type that is choosen
    const [company, setcompany] = React.useState(''); // the company that is choosen
    const [companies, setCompanies] = React.useState([]); // the companies that are available

    // get data from qr code
    const [deviceId, setDeviceId] = React.useState('');

    const getDeviceId = (deviceId) => {
        setDeviceId(deviceId);
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
        fetch(`${apiURL}addNode?key=${process.env.REACT_APP_TRACT_API_KEY}&deviceid=${deviceId}&devicetype=${nodeType}&companyid=${company}`)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                },
                (error) => {
                    console.log(error);
                }
        )
    }

    return (
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
            <Typography variant="h5" gutterBottom>Node sensor type</Typography>

                <FormControl fullWidth>
                    <InputLabel style={{backgroundColor: "white"}} id="node-type">Node type</InputLabel>
                    <Select
                        labelId='node-type'
                        id='node-type'
                        value={nodeType}
                        onChange={handleNodeTypeChange}
                    >
                        <MenuItem value={1}>Temperature</MenuItem>
                        <MenuItem value={2}>Humidity</MenuItem>
                        <MenuItem value={3}>Switch</MenuItem>
                        <MenuItem value={4}>Wheel thingy (i dont remember the name)</MenuItem>
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
                <Button variant="outlined" color="primary" style={{width: '100%', marginTop: '1rem'}} onClick={sendDevice}>
                    {t('addNode')}
                </Button>
            </div>
        </Box>
    )
}

export default AddNode