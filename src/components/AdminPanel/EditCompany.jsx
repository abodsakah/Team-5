import React, {useEffect} from 'react'
import { useParams  } from 'react-router-dom';
import {Box, Button, Divider, Grid, Typography, styled, TextField, Snackbar, Alert} from '@mui/material'
import LoadingOverlay from '../LoadingOverlay';
import ColorPicker from 'material-ui-color-picker'
import axios from 'axios';

function EditCompany({t, apiURL}) {
  const companyId = useParams().id;

  const [companyName, setCompanyName] = React.useState('');
  const [companyEmail, setCompanyEmail] = React.useState('');
  const [companyPhone, setCompanyPhone] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [snacksBarOpen, setSnacksBarOpen] = React.useState(false);
  const [mainColorInput, setMainColorInput] = React.useState(`#448bc9`);
  const [fileData, setFileData] = React.useState(null);
  const [CompanyId, setCompanyId] = React.useState('');
  
  const ColorSample = styled('div')`
      background-color: ${mainColorInput};
      width: 1rem;
      height: 1rem;
      border-radius: 5px;
      padding: 10px;
      margin: 10px;
  `;

 
  
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  const getCompanyInfo = () => {
    fetch(`${apiURL}/getCompany?key=${process.env.REACT_APP_TRACT_API_KEY}&companyid=${companyId}`).then(res => res.json()).then(res => {
        setCompanyId(res.id);
        setCompanyName(res.name);
        setCompanyEmail(res.support_email);
        setCompanyPhone(res.support_phone);
        setMainColorInput(res.color);
      });
  };

  useEffect(() => {
    getCompanyInfo();
  }, []);


  const updateAPI = () => {
    setLoading(true);
    let data = new FormData();

    data.append('key', process.env.REACT_APP_TRACT_API_KEY);
    data.append('companyid', CompanyId);
    data.append('color', mainColorInput.replace('#', ''));
    data.append('logo', fileData);
    data.append('name', companyName);
    data.append('email', companyEmail);
    data.append('phone', companyPhone);

    axios.post(`${apiURL}/updateCompany`, data).then(res => {
      setLoading(false);
      return res;
    }).catch(err => {
      console.log(err);
    });
    window.location = `/admin/companies`;
  };

  const handleClose = () => {
    setSnacksBarOpen(false);
  }

  let ValidateAndSubmit = () => {
    if (companyName === '' || companyEmail === '' || companyPhone === '') {
      alert('Please fill all the fields');
    } else {
      setLoading(true);
      updateAPI();
    }
  }

  const handleColorChange = (color) => {
    if (color) {
        setMainColorInput(color.replace('#', ''));
    }
  }

  const handleFileData = (e) => {
    if (e.target.files[0]) {
        setFileData(e.target.files[0]);
    }
  }

  return (
  <>
      <LoadingOverlay loading={loading} />
      {status !== '' &&
                <Snackbar open={snacksBarOpen} autoHideDuration={6000} key={'topright'} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={'error'} sx={{width: '100%'}}>
                        {status}
                    </Alert>
                </Snackbar>
      }
    <Box m={2}>
    
        <Typography variant="h4">{t('editCompany')}</Typography>
      <br />
      <Divider />
      <br />
      <Typography variant="h6">{t('companiesInformation')}</Typography>
      <br />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TextField
            id="outlined-basic"
            label={t('companyName')}
            variant="outlined"
            style={{width: '100%'}}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            id="outlined-basic"
            label={t('supportEmail')}
            variant="outlined"
            style={{width: '100%'}}
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            id="outlined-basic"
            label={t('supportPhone')}
            variant="outlined"
            style={{width: '100%'}}
            value={companyPhone}
            onChange={(e) => setCompanyPhone(e.target.value)}
          />
        </Grid>
      </Grid>
      <br />
      <Typography variant="h6">{t('websiteStyling')}</Typography>
      <br />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <input type={"file"} onChange={handleFileData}/>
        </Grid>
        <Grid item xs={12} md={6}>
            <input type="color" name="mainColor" value={`#${mainColorInput}`} onChange={(e) => {handleColorChange(e.target.value)}}/>
        </Grid>
      </Grid>
      <br />
      <Button variant="outlined" style={{width: '100%'}} onClick={() => ValidateAndSubmit()}>
        {t('updateCompany')}
      </Button>
    </Box>
  </>
  )
}

export default EditCompany;