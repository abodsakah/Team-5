import {Box, Button, Divider, Grid, Typography, styled, TextField, Snackbar, Alert} from '@mui/material'
import React, {useEffect} from 'react'
import LoadingOverlay from '../LoadingOverlay';
import ColorPicker from 'material-ui-color-picker'
import axios from 'axios';

function AddCompany({t, color, apiURL}) {

  const [companyName, setCompanyName] = React.useState('');
  const [companyEmail, setCompanyEmail] = React.useState('');
  const [companyPhone, setCompanyPhone] = React.useState('');
  const [companyAdminMail, setCompanyAdminMail] = React.useState('');
  const [companyAdminFName, setCompanyAdminFName] = React.useState('');
  const [companyAdminLName, setCompanyAdminLName] = React.useState('');
  const [companyAdminUser, setCompanyAdminUser] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [snacksBarOpen, setSnacksBarOpen] = React.useState(false);
  const [mainColorInput, setMainColorInput] = React.useState(`#448bc9`);
  const [fileData, setFileData] = React.useState(null);
  const [newCompanyId, setNewCompanyId] = React.useState('');
  const [currStep, setCurrStep] = React.useState(0);
  const [inputValid, setInputValid] = React.useState(false);

  const ColorSample = styled('div')`
      background-color: ${mainColorInput};
      width: 1rem;
      height: 1rem;
      border-radius: 5px;
      padding: 10px;
      margin: 10px;
  `;
  
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  let createAPI = () => {
    if (companyEmail.match(emailRegEx) && companyAdminMail.match(emailRegEx) && companyAdminUser.length > 0 && companyAdminFName.length > 0 && companyAdminLName.length > 0 && companyName.length > 0 && companyPhone.length > 0) {
      fetch(`${apiURL}/createCompany?key=${process.env.REACT_APP_TRACT_API_KEY}&name=${companyName}&email=${companyEmail}&phone=${companyPhone}&adminmail=${companyAdminMail}&adminfirstname=${companyAdminFName}&adminlastname=${companyAdminLName}&adminusername=${companyAdminUser}`)
        .then(res => res.json())
        .then(res => {
          if (res.status === "success") {
            setCurrStep(1);
            setLoading(false);
            setNewCompanyId(res.companyId);
          }
        }).catch(err => {
          setStatus(t("coudntAddCompany"));
          setSnacksBarOpen(true);
          setLoading(false);
        });
    } else {
      setStatus(t("invalidInput"));
      setSnacksBarOpen(true);
      setLoading(false);
    }
  }

  const createStyling = () => {
    setLoading(true);
    let data = new FormData();

    data.append('key', process.env.REACT_APP_TRACT_API_KEY);
    data.append('id', newCompanyId);
    data.append('color', mainColorInput.replace('#', ''));
    data.append('logo', fileData);
    axios.post(`${apiURL}/addStyling`, data).then(res => {
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
    if (companyName === '' || companyEmail === '' || companyPhone === '' || companyAdminMail === '' || companyAdminFName === '' || companyAdminLName === '' || companyAdminUser === '') {
      alert('Please fill all the fields');
    } else {
      setLoading(true);
      createAPI();
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
      {currStep === 0 &&
        <Box m={2}>
        
          <Typography variant="h4">{t('addCompany')}</Typography>
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
          <Typography variant="h6">{t('companyAdminInformation')}</Typography>
          <br />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                md={12}
                id="outlined-basic"
                label={t('adminFirstName')}
                variant="outlined"
                style={{width: '100%'}}
                value={companyAdminFName}
                onChange={(e) => setCompanyAdminFName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="outlined-basic"
                label={t('adminLastName')}
                variant="outlined"
                style={{width: '100%'}}
                value={companyAdminLName}
                onChange={(e) => setCompanyAdminLName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="outlined-basic"
                label={t('adminMail')}
                variant="outlined"
                style={{width: '100%'}}
                value={companyAdminMail}
                onChange={(e) => setCompanyAdminMail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="outlined-basic"
                label={t('adminUsername')}
                variant="outlined"
                style={{width: '100%'}}
                value={companyAdminUser}
                onChange={(e) => setCompanyAdminUser(e.target.value)}
              />
            </Grid>
          </Grid>
          <br />
          <Button variant="outlined" style={{width: '100%', borderColor: color, color: color}} onClick={() => ValidateAndSubmit()}>
            {t('addCompany')}
          </Button>
        </Box>
      }
      {currStep === 1 &&
    <Box p={2}>
        <Typography variant="h3">{t('logo')}</Typography>
        <br />
        <input type={"file"} onChange={handleFileData}/>
        <br />
        <br />
        <Divider />
        <Typography variant="h3">{t('websiteStyling')}</Typography>
        <br />
        <Typography variant="body1">
            {t("websiteStylingDescription")}
        </Typography>
        <br />
        <Typography variant="h5">{t("mainColor")}</Typography>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <input type="color" name="mainColor" value={`#${mainColorInput}`} onChange={(e) => {handleColorChange(e.target.value)}}/>
        </Box>
        <br />
        <Button variant="contained" color="primary" onClick={() => {
            // set color withou #
            setMainColorInput(mainColorInput.replace('#', ''));
            createStyling();
        }} >
            {t("save")}
        </Button>
      </Box>
      }
  </>
  )
}

  export default AddCompany