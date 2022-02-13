import React from 'react';
import {styled} from '@mui/system'
import {Button, Card, CircularProgress} from '@mui/material';
import {useAuth0} from '@auth0/auth0-react';


const Login = ({loading, cookies}) => {


  const LoginContainer = styled('div')`
    background-color: #e7ebf0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;'
  `;

  const {loginWithRedirect, loginWithPopup, isAuthenticated, user} = useAuth0();  

  let userID;


  if (isAuthenticated && !cookies.get('userInfo')) {
    userID = user.sub.split('|')[1];
    loading = true;
    fetch(`http://localhost:9000/api/user?key=${process.env.REACT_APP_TRACT_API_KEY}&id=${userID}`).then(res => res.json()).then(data => {
      console.log(data);
      cookies.set("userInfo", data, {path: '/'});
      window.location.reload();
    });
  }

  
  return (
    <LoginContainer style={{height: '100vh'}}>
      <Card style={{padding: '5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <img src={require('./static/images/Asset 1.png')} style={{height: '8%', marginBottom: '1rem'}} />
        {loading ? (<><h3>Loading</h3><CircularProgress /></>) :
          (<Button onClick={() => loginWithPopup()} variant="contained" style={{padding: '1rem', width: '100%'}}>Login</Button>)
        }
      </Card>
    </LoginContainer>
  );
}

export default Login;
