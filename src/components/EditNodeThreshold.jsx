import React, {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom';
import {Button, Box, FormControl, InputLabel, MenuItem, Select, styled, TextField, Typography, Snackbar, Alert, Slider, FormLabel, RadioGroup, FormControlLabel, Radio, CircularProgress} from '@mui/material';
import axios from 'axios';
import LoadingOverlay from './LoadingOverlay';

const EditNodeThreshhold  = ({t, apiURL, user}) => {

  const deviceId = useParams().id;
  // const [device, setDevice] = useState({});
  let device = {};
  const [deviceType, setDeviceType] = useState('');
  const [oldThreshold, setOldThreshold] = useState(null);
  const [action, setAction] = useState('');
  
  const [choosenTemp, setChoosenTemp] = React.useState(0);
  const [choosenSwitch, setChoosenSwitch] = React.useState(0);
  const [choosenAnalog, setChoosenAnalog] = React.useState(0);
  const [threshold, setThreshold] = React.useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);
  
  const navigate = useNavigate();

  const handleChangeTemp = (event) => {
    setChoosenTemp(event.target.value);
    setThreshold(event.target.value);
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
  }

  const updateThreshold = () => {
    setIsLoadingOverlay(true);
    let data = new FormData();
    data.append('key', process.env.REACT_APP_TRACT_API_KEY);
    data.append('id', deviceId);
    data.append('action', action);
    data.append('value', threshold);
    data.append('companyid', user.company_id);

    axios.post(`${apiURL}/updateThreshold`, data).then(res => {
      if (res.data.status === 'success') {
        setIsLoadingOverlay(false);
        navigate('/devices');
      }
    }
    ).catch(err => {
      setIsLoadingOverlay(false);
      console.log(err);
    })
  }

  const getThreshold = () => {
    fetch(`${apiURL}/getThreshold?key=${process.env.REACT_APP_TRACT_API_KEY}&id=${deviceId}&companyId=${user.company_id}`).then(res => res.json()).then(data => {
      setOldThreshold(data.threshold);
      setDeviceType(data.device.type);
      if (data.device.type === 1) {
        setChoosenTemp(data.threshold.threshold);
      } else if (data.device.type === 2) {
        setChoosenSwitch(data.threshold.threshold);
      } else if (data.device.type === 3) {
        setChoosenAnalog(data.threshold.threshold);
      }
      setAction(data.threshold.action);
      setIsLoading(false);
    }
    ).catch(err => {
      console.log(err);
    });
  }

  useEffect(() => {
    getThreshold();
  }, [])



  return (
    <>
      {isLoadingOverlay && <LoadingOverlay loading={isLoadingOverlay} />}
      {isLoading ?(
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '1rem',
          height: '90%',
       }}  >
          <CircularProgress />
          <Typography variant="h6" style={{marginTop: '1rem', textAlign: 'center', fontWeight: '100'}}>Loading</Typography>
        </Box>
      )
        : (
          <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '1rem',
            }}>
              <Typography variant="h5" gutterBottom>{t('sensorType')} {deviceType === 1 ? t('tempSensor') : deviceType === 3 ? t('analogSensor') : deviceType === 2 && t('switchSensor')}
              </Typography>
              {deviceType === 1 ?
                <>
                  <Typography variant="h5" gutterBottom>{t('chooseTemp')}</Typography>
                  <FormControl>
                    <FormLabel>{t('action')}</FormLabel>
                    <RadioGroup aria-label="action" name="action" value={action} onChange={handleChangeAction}>
                      <FormControlLabel value="OVER" control={<Radio />} label={t('over')} />
                      <FormControlLabel value="UNDER" control={<Radio />} label={t('under')} />
                      <FormControlLabel value="SAME" control={<Radio />} label={t('equal')} />
                    </RadioGroup>
                  </FormControl>
                  <Slider
                    value={choosenTemp}
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
                        <FormControlLabel value="OVER" control={<Radio />} label={t('over')} />
                        <FormControlLabel value="UNDER" control={<Radio />} label={t('under')} />
                        <FormControlLabel value="SAME" control={<Radio />} label={t('equal')} />
                      </RadioGroup>
                    </FormControl>
                    <Typography variant="h5" gutterBottom>{t('chooseAnalog')}</Typography>
                    <TextField id="analog" label="Analog" type='number' variant="outlined" fullWidth onChange={handleChangeAnalog} value={choosenAnalog} required />
                  </>
              }
              <Button variant="contained" color="primary" style={{width: '100%', marginTop: '1rem', marginBottom: '1rem'}} onClick={updateThreshold}>{t("submit")}</Button>
          </Box>
        )}
    </>
  )
}

export default EditNodeThreshhold