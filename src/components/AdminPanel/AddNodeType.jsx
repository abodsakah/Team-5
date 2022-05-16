import {Box, Button, TextField, Typography} from '@mui/material'
import React, {useState} from 'react'

function AddNodeType({t, apiURL}) {
    const [idNode, setIdNode] = React.useState('');
    const [name, setName] = React.useState('');
    const [settingID, setSettings] = React.useState('');
    const [setLoading] = React.useState(false);


    let ValidateAndSubmitNodeType = () => {
        if ( idNode === '' || name === '' || settingID === '') {
            alert(`${t('pleaseEnter')}`);
        } else {
            setLoading(true);
        }
    }
  
    return (
      <Box m={2}>
          <Typography variant="h4">{t("addNodeType")}</Typography>
        <br />
          <TextField
              id="outlined-basic"
              label={'id'}
              variant="outlined"
              style={{width: '100%'}}
              onChange={(e) => setIdNode(e.target.value)}
            />
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
            onChange={(e) => setSettings(e.target.value)}
          />
        <br />
        <br />
        <Button variant="outlined" style={{ marginBottom: '1rem' }} onClick={() => ValidateAndSubmitNodeType()}>
            {t('addNodeType')}
        </Button>
        </Box>
    )
}

export default AddNodeType

