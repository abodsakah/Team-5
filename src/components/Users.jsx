import {Box, Button, Divider, Grid, TextField, Typography} from '@mui/material'
import React, {useEffect} from 'react'

function AddUser() {

  const [userMail, setuserMail] = React.useState('');
  const [firstName, setfirstName] = React.useState('');
  const [lastName, setlastN] = React.useState('');
  const [newUser, setnewUser] = React.useState('');
  const [loading, setLoading] = React.useState(false);


  let ValidateAndSubmit = () => {
    if (userMail === '' || firstName === '' || lastName === '' || newUser === '') {
      alert('Please fill all the fields');
    } else {
      setLoading(true);
    }
  }

  return (
    <Box m={2}>
        <Typography variant="h4">Add User</Typography>
        <br />
        <Divider />
        <br />
      <br />
      <Typography variant="h6">{'User Information'}</Typography>
      <br />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-basic"
            label={'First Name'}
            variant="outlined"
            style={{width: '100%'}}
            onChange={(e) => setfirstName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-basic"
            label={'Last Name'}
            variant="outlined"
            style={{width: '100%'}}
            onChange={(e) => setlastN(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-basic"
            label={'Mail'}
            variant="outlined"
            style={{width: '100%'}}
            onChange={(e) => setuserMail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-basic"
            label={'Mob'}
            variant="outlined"
            style={{width: '100%'}}
            onChange={(e) => setnewUser(e.target.value)}
          />
        </Grid>
      </Grid>
      <br />
      <Button variant="outlined" style={{width: '100%'}} color="primary" onClick={() => ValidateAndSubmit()}>
        {'Add User'}
      </Button>
      </Box>
  )
}

  export default AddUser
