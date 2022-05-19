import {Box, Button, Divider, TextField, Typography} from '@mui/material'
import React, {useState} from 'react'
import axios from 'axios';

function AddNodeType({t, apiURL}) {
    const [name, setName] = React.useState('');
    const [appSetting, setAppSetting] = React.useState('');

    let ValidateAndSubmitNodeType = () => {
        if ( name === '' || appSetting === '') {
            alert(`${t('pleaseEnter')}`);
        } else {
          let data = new FormData();
          data.append('key', process.env.REACT_APP_TRACT_API_KEY);
          data.append('typeName', name);
          data.append('appSetting', appSetting);

          axios.post(`${apiURL}/createNodeType`, data)
            .then(res => {
                console.log(res);
                alert(`${t('nodeTypeCreated')}`);
            })
            .catch(err => {
                console.log(err);
                alert(`${t('errorOccuredWhileCreatingNode')}`);
            });
          
        }
    }
  
    return (
      <Box m={2}>
          <Typography variant="h4">{t("addNodeType")}</Typography>
        <br />
        < Divider />
        <br />
        <br />
        <TextField
          id="outlined-basic"
          label={'Name'}
          variant="outlined"
          style={{width: '100%'}}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <br />
        <TextField
          id="outlined-basic"
          label={'SettingsID'}
          variant="outlined"
          style={{width: '100%'}}
          onChange={(e) => setAppSetting(e.target.value)}
        /><br />
        <br />
        <Button variant="outlined" style={{ marginBottom: '1rem' }} onClick={() => ValidateAndSubmitNodeType()}>
            {t('addNodeType')}
        </Button>
        </Box>
    )
}

export default AddNodeType

