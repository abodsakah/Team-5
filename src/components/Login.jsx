import React from 'react';
import {styled} from '@mui/system'
import {Button, Card, CardHeader, TextField, Typography, Alert, AlertTitle} from '@mui/material';

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
