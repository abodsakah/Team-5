import React, {useEffect, useRef, useState} from 'react'
import {Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, styled, TextField, Typography, Snackbar, Alert, Slider, FormLabel, RadioGroup, FormControlLabel, Radio} from '@mui/material';
import { QrReader } from 'react-qr-reader'
import LoadingOverlay from './LoadingOverlay';

const Scanners = ({getDeviceId}) => {
    const [data, setData] = useState('');
    const [error, setError] = useState('');
    
    useEffect(() => {
        if (data) {
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
            {data &&
                <Typography variant="h6" style={{marginTop: '1rem'}}>
                    Code: {data}
                </Typography>
            }
      </div>
    );
}

const QrContainers = styled("div")`
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

function AddSensor({t, apiURL, user}) {

    const [isLoading, setIsLoading] = React.useState(false); // is the loading indicator visible

    const [buildings, setbuildings] = React.useState([]); // the buildings that are available
    const [spaces, setSpaces] = React.useState([]); // the spaces that are available
    const [assets, setAssets] = React.useState([]); // the assets that are available

    const [step, setStep] = React.useState(1); // the step that is selected

    const [selectedBuilding, setSelectedBuilding] = React.useState('');
    const [selectedSpace, setSelectedSpace] = React.useState('');
    const [selectedAsset, setSelectedAsset] = React.useState('');

    // get data from qr code
    const [deviceId, setDeviceId] = React.useState('');
    const [deviceName, setDeviceName] = React.useState('');

    const [deviceType, setDeviceType] = React.useState(null);

    const [choosenTemp, setChoosenTemp] = React.useState(10);
    const [choosenSwitch, setChoosenSwitch] = React.useState(1);
    const [choosenAnalog, setChoosenAnalog] = React.useState(1000);
    const [action, setAction] = React.useState('UP');
    const [threshold, setThreshold] = React.useState('1');

    const [formIsValid, setFormIsValid] = React.useState(false);
    const [error, setError] = React.useState('');
    const [snacksBarOpen, setSnacksBarOpen] = React.useState(false);

    // to be able to change the text
    const onUidTextChange = (e) => {
        if (e.target) {
            setDeviceId(e.target.value);
        }
    }

    const handleDeviceNameChange = (e) => {
        if (e.target) {
            setDeviceName(e.target.value);
        }
    }

    // sets the device id from the qr code
    const getDeviceId = (deviceId) => {
        setDeviceId(deviceId);
        onUidTextChange(deviceId);
    }

    const checkValid = () => {

        if (selectedBuilding !== '' && selectedAsset !== '' && deviceId !== '') {
            setFormIsValid(true);
        }
    }

    const handleBuildingChange = (event) => {
        setSelectedBuilding(event.target.value);
    }
 
    const handleSpaceChange = (event) => {
        setSelectedSpace(event.target.value); 
    }

    const handleAssetChange = (event) => {
        setSelectedAsset(event.target.value); 
    }

    const getBuildings = async () => {
        if (buildings.length === 0) {
            let buildingsData = await fetch(`${apiURL}/getBuildings?key=${process.env.REACT_APP_TRACT_API_KEY}&companyId=${user.company_id}`)
            let buildingJson = await buildingsData.json().then(data => Object.keys(data).map(key => data[key]));
            setbuildings(buildingJson);
        }
    }
    getBuildings();

    const getSpaces = async () => {
        setSelectedSpace('');
        let spacesData = await fetch(`${apiURL}/getSpaces?key=${process.env.REACT_APP_TRACT_API_KEY}&parentId=${selectedBuilding}`)
        let spacesJson = await spacesData.json().then(data => Object.keys(data).map(key => data[key]));
        setSpaces(spacesJson);
    }

    const getAssets = async () => {
        let space;
        if (selectedSpace !== '') {
            space = selectedSpace;
        } else {
            space = selectedBuilding;
        }

        let assetsData = await fetch(`${apiURL}/getAssetsForSpace?key=${process.env.REACT_APP_TRACT_API_KEY}&spaceId=${space}`);
        let assetsJson = await assetsData.json().then(data => Object.keys(data).map(key => data[key]));
        setAssets(assetsJson);
    }

    const handleChangeTemp = (event) => {
        setChoosenTemp(event.value);
    }

    const handleChangeSwitch = (event) => {
        setAction("SAME")
        setChoosenSwitch(event.target.value);
        setThreshold(event.target.value);
    }

    const handleChangeAnalog = (event) => {
        setChoosenAnalog(event.target.value);
        setThreshold(event.target.value);
    }

    const handleChangeAction = (event) => {
        setAction(event.target.value);
        setThreshold(event.target.value);
    }

    const handleError = (error) => {
        setError(error);
        setSnacksBarOpen(true);
    }

    const handleClose = () => {
        setSnacksBarOpen(false);
    }

    useEffect(() => {
        getSpaces();
        getAssets();
        checkValid();
    }, [selectedBuilding]);

    useEffect(() => {
        checkValid();
    }, [deviceId]);

    useEffect(() => {
        getAssets();
        checkValid();
    }, [selectedSpace]);

    useEffect(() => {
        checkValid();
    }, [selectedAsset, deviceId, deviceName]);

    
    const sendDevice = () => {
        setIsLoading(true);
        let data = new FormData();
        data.append('key', process.env.REACT_APP_TRACT_API_KEY);
        data.append('companyId', user.company_id);
        data.append('deviceUid', deviceId);
        data.append('deviceName', deviceName);
        data.append('is_part_of', selectedAsset);

        fetch(`${apiURL}/addLogicalDevice`, {
            method: 'POST',
            body: data
        })
            .then(response => response.json())
            .then(data => {
                if(data){
                    setIsLoading(false);
                    setDeviceType(data.type);
                    setStep(2);
                }
            }).catch(error => {
                handleError(t("couldntAddDevice"));
                setIsLoading(false);
            }
        );

    }

    const sendDeviceType = () => {
        if (action && action != '' && threshold && threshold != '') { 
            setIsLoading(true);
            let data = new FormData();
            data.append('key', process.env.REACT_APP_TRACT_API_KEY);
            data.append('deviceUid', deviceId);
            data.append('threshold', threshold);
            data.append('thresholdAction', action);

            fetch(`${apiURL}/updateSensorThreshold`, {
                method: 'POST',
                body: data
            })
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        if(data.status === "Success") {
                            setIsLoading(false);
                            // navigate to /devices
                            window.location.href = '/devices';
                        }
                    }
                })
        }else{
            handleError(t("pleaseSelectAnAction"));
        }
    }

    return (
        <>
            {error !== '' &&
                <Snackbar open={snacksBarOpen} autoHideDuration={6000} key={'topright'} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={'error'} sx={{width: '100%'}}>
                        {error}
                    </Alert>
                </Snackbar>
            }
        <LoadingOverlay loading={isLoading}/>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            }}>
        { step === 1 ?
            <>
            <QrContainers>
                <Typography variant="h5" style={{
                    textAlign: 'center',
                }} gutterBottom>{t('scanQRAddNode')}
                </Typography>
            <Scanners getDeviceId={getDeviceId}/>
            </QrContainers>
                <div >
                    <Typography variant="h5" gutterBottom>{t('sensorName')}</Typography>
                    <TextField
                        id="name"
                        label={t('name')}
                        variant="outlined"
                        onChange={handleDeviceNameChange}
                        value={deviceName}
                        style={{
                            marginBottom: '1rem',
                            minWidth: '18em'
                        }}
                    />
                    <br />
                    <Typography variant="h5" gutterBottom>{t('sensorPosition')}</Typography>
                    <FormControl fullWidth >
                        <InputLabel style={{ backgroundColor: "white", textTransform: "capitalize" }} id="node-type">{t('position')}</InputLabel>
                        <Select
                            labelId='node-type'
                            id='node-type'
                            value={selectedBuilding}
                            onChange={handleBuildingChange}
                        >
                            {buildings.map((building, index) => {
                                return (
                                    <MenuItem key={index} value={building.id}>{building.name}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    {spaces.length > 0 &&
                        <>
                            <br />
                            <br />
                            <FormControl fullWidth>
                                <InputLabel style={{backgroundColor: "white"}} id="node-type">Space</InputLabel>
                                <Select
                                    labelId='node-type'
                                    id='node-type'
                                    value={selectedSpace}
                                    onChange={handleSpaceChange}
                                >
                                    {spaces.map((space, index) => {
                                        return (
                                            <MenuItem key={index} value={space.id}>{space.name}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </>
                    }
                    {assets.length > 0 &&
                        <>
                            <br />
                            <br />
                            <FormControl fullWidth>
                                <InputLabel style={{backgroundColor: "white"}} id="node-type">Assets</InputLabel>
                                <Select
                                    labelId='node-type'
                                    id='node-type'
                                    value={selectedAsset}
                                    onChange={handleAssetChange}
                                >
                                    {assets.map((asset, index) => {
                                        return (
                                            <MenuItem key={index} value={asset.id}>{asset.name}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </>
                    }
                    {formIsValid ?
                        <Button variant="outlined" color="primary" style={{width: '100%', marginTop: '1rem', marginBottom: '1rem'}} onClick={sendDevice}>
                            {t('addSensor')}
                        </Button>
                        :
                        <Button variant="outlined" disabled color="primary" style={{width: '100%', marginTop: '1rem', marginBottom: '1rem'}} onClick={sendDevice}>
                            {t('addSensor')}
                        </Button>
                    }
                </div>  
                    </>
                    :
                    <>
                        <Typography variant="h5" gutterBottom>{t('sensorType')} {deviceType === 1 ? t('tempSensor') : deviceType === 3 ? t('analogSensor') : deviceType === 2 && t('switchSensor')}
                        </Typography>
                        {deviceType === 1 ? 
                            <>
                                <Typography variant="h5" gutterBottom>{t('chooseTemp')}</Typography>
                                <FormControl>
                                    <FormLabel>{t('action')}</FormLabel>
                                    <RadioGroup aria-label="action" name="action" value={action} onChange={handleChangeAction}>
                                        <FormControlLabel value="UP" control={<Radio />} label={t('over')} />
                                        <FormControlLabel value="DOWN" control={<Radio />} label={t('under')} />
                                        <FormControlLabel value="SAME" control={<Radio />} label={t('equal')} />
                                    </RadioGroup>
                                </FormControl>
                                <Slider
                                    defaultValue={32}
                                    aria-label="Default"
                                    valueLabelDisplay="auto"
                                    step={1}
                                    marks={[{value: -40, label: '-40°C'}, {value: 100, label: '100°C'}]}
                                    min={-40}
                                    max={100}
                                    onChange={handleChangeTemp}
                                />
                            </>
                            :
                            deviceType === 2 ?
                                <>
                                    <FormControl>
                                        <FormLabel>{t('chooseSwitch')}</FormLabel>
                                        <RadioGroup aria-label="position" name="value" value={choosenSwitch} onChange={handleChangeSwitch} row>
                                            <FormControlLabel value="1" control={<Radio />} label={t('on')} />
                                            <FormControlLabel value="0" control={<Radio />} label={t('off')} />
                                        </RadioGroup>
                                    </FormControl>
                                </>
                                :
                                deviceType === 3 &&
                                <>
                                    <FormControl>
                                        <FormLabel>{t('action')}</FormLabel>
                                        <RadioGroup aria-label="action" name="action" value={action} onChange={handleChangeAction}>
                                            <FormControlLabel value="UP" control={<Radio />} label={t('over')} />
                                            <FormControlLabel value="DOWN" control={<Radio />} label={t('under')} />
                                            <FormControlLabel value="SAME" control={<Radio />} label={t('equal')} />
                                        </RadioGroup>
                                    </FormControl>
                                    <Typography variant="h5" gutterBottom>{t('chooseAnalog')}</Typography>
                                    <TextField id="analog" label="Analog" type='number' variant="outlined" fullWidth onChange={handleChangeAnalog} value={choosenAnalog} required/>
                                </>
                        }
                        <Button variant="contained" color="primary" style={{width: '100%', marginTop: '1rem', marginBottom: '1rem'}} onClick={sendDeviceType}>{t("submit")}</Button>
                    </>            
    }
        </Box>
    </>
    )
}

export default AddSensor
