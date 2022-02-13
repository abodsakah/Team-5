import React from 'react';
import {styled} from '@mui/system'
import {Button, Card, CircularProgress} from '@mui/material';
import {useAuth0} from '@auth0/auth0-react';


const Login = ({loading}) => {


  const LoginContainer = styled('div')`
    background-color: #e7ebf0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;'
  `;

  const {loginWithRedirect, loginWithPopup} = useAuth0();  
  // http://localhost:9000/api/user?key=377307b0-fdf6-4762-8403-00084d164de5&id=620523493dbc5d0068b2f2a9
  return (
    <LoginContainer style={{height: '100vh'}}>
      <Card style={{padding: '5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <img src={require('./static/images/Asset 1.png')} style={{height: '8%', marginBottom: '1rem'}} />
        {loading ? (<><h3>Loading</h3><CircularProgress /></>) :
          <Button onClick={() => loginWithPopup()} variant="contained" style={{padding: '1rem', width: '100%'}}>Login</Button>
        }
        
      </Card>
    </LoginContainer>
  );
}

export default Login;
