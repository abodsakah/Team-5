import React from 'react';
import {styled} from '@mui/system'
import {Button, Card, CardHeader, TextField, Typography, Alert, AlertTitle} from '@mui/material';
import {useAuth0} from '@auth0/auth0-react';
import axios from 'axios';


const Login = ({cookie}) => {


  const LoginContainer = styled('div')`
    background-color: #e7ebf0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;'
  `;

  const Form = styled('form')`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center
  `;
  const {loginWithRedirect} = useAuth0();

  var options = {
    method: 'POST',
    url: 'https://dev-dg2ss3q4.us.auth0.com/oauth/token',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: {
      grant_type: 'password',
      username: 'user@example.com',
      password: 'pwd',
      audience: 'https://team5.abodsakka.xyz',
      scope: 'read:sample',
      client_id: 'v24Hc653f4fEPO3aqPREwzAfzN8SrXYP',
      client_secret: '3PDhVJz4gL76PLqbMwo8WDlh8C0K-GDPV_0X9bioMfQ2rehgC3rqeUSu8UpUPJie'
    }
  };

  
  axios.request(options).then(function (response) {
    console.log(response.data);
  }).catch(function (error) {
    console.log(error);
  });

  const checkValid = () => {
    // gets the email and password from the form
    let mail = document.getElementById('mail').value;
    let password = document.getElementById('password').value;
    let errorMsg = document.getElementById('error');
    // to make sure that the fields are not empty and that the email syntax is correct
    let validEmail = false;
    let validPassword = false;

    
    // if mail field is not empty and if the email syntax is correct
    if (mail.length > 0) {
      if (mail.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        validEmail = true;
      }
    }

    if (password.length > 0) {
      validPassword = true;
    } 

    if (validEmail && validPassword) {
      errorMsg.style.display = 'none';
      console.log('valid');
    } else {
      console.log('invalid');
      errorMsg.style.display = 'flex';
    }
  };

  return (
    <LoginContainer style={{height: '100vh'}}>
      <Card style={{padding: '5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <img src={require('./static/images/Asset 1.png')} style={{height: '8%', marginBottom: '1rem'}}/>
        <Typography variant='h4' style={{marginBottom: '2rem', textAlign: 'center'}}>Login</Typography>
        <Alert id='error' severity="error" style={{marginBottom: '2rem', display: 'none'}}>Email and/or password not correct</Alert>
        <Form>
          <TextField  required id={'mail'} style={{marginBottom: '1rem'}} label="Email" variant="outlined" />
          <TextField required id={'password'} type={'password'} style={{marginBottom: '1rem'}} label="Password" variant="outlined" />
          <Button onClick={() => checkValid()} variant="contained" style={{padding: '1rem', width: '100%'}}>Login</Button>
        </Form> 
      </Card>
    </LoginContainer>
  );
}

export default Login;
