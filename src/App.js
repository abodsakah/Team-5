/* ---------------------------------- React --------------------------------- */
import * as React from 'react';
import { useCallback, useState, useEffect } from 'react';
import {Route, BrowserRouter, Routes} from 'react-router-dom';

/* ------------------------------- Components ------------------------------- */
import Index from './components/Index';
import Devices from './components/Devices';
import DeviceCategory from './components/DeviceCategory';
import Users from './components/Users';
import Admin from './components/AdminPanel/Admin';
import AddCompany from './components/AdminPanel/AddCompany';
import AddNode from './components/AdminPanel/AddNode';
import Nodes from './components/AdminPanel/Nodes';

/* ------------------------------- Material Ui ------------------------------ */
import { styled, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Login from './components/Login';
import Rules from './components/Rules';

/* --------------------------------- Cookies -------------------------------- */
import Cookies from 'universal-cookie';

/* ---------------------------------- Auth0 --------------------------------- */
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/Navbar';

/* ------------------------------- Translation file ------------------------------- */
import {t} from './translator'

function App() {
  
  // let apiURL = "https://api.abodsakka.xyz/api/"; // The url where the api is going to be called (server)
  let apiURL = "http://localhost:9000/api/"; // The url where the api is going to be called (local)

  const drawerWidth = 240; // the width of the drawer


  const cookies = new Cookies(); // create a new cookie instance

  const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: `${drawerWidth}px`,
        }),
    }),
  );


  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

  const {user, isAuthenticated, isLoading, logout } = useAuth0(); // get user info
  const [error, setError] = useState(''); // set error state
  const [open, setOpen] = useState(false); // set drawer state
  const [userData, setUserData] = useState({}); // set drawer state
  
  /* -------------------------------------------------------------------------- */
  /*                   ENABLE WHEN DEBUGING OR WORKING LOCALY                   */
  /* -------------------------------------------------------------------------- */
  if (cookies.get('user') === undefined) { // if there is no "user" cookie
    let userID;
    if (isAuthenticated) { // only when the user is authenticated we set the cookie
      try {
        userID = user.sub.split('|')[1]; // get the user id from the user object
        fetch(`${apiURL}user?key=${process.env.REACT_APP_TRACT_API_KEY}&id=${userID}`).then(res => res.json()).then(data => {
          cookies.set('user', data, {path: '/'}); // set the cookie
          setUserData(data); // set the user data
          return data; // return the user data to update the DOM
        });
      } catch (error) {
        console.log(`Error: ${error}`);
      }

    }

  }


  // if the application is loading or the user is not authenticated, render the login page
  if (isLoading || !isAuthenticated) {
    return <Login loading={isLoading} cookies={cookies}/>
  }


    return (
    <BrowserRouter>
      <Navbar setOpen={setOpen} open={open} userName={user.name} image={user.picture} logout={logout} cookies={cookies} t={t}/>
      <Box sx={{display: 'flex', flexGrow: 1}} style={{height: '100vh'}}>
        <Main open={open}>
          <DrawerHeader />
          <h1>{error}</h1>
          {/* The application router */}
          <Routes>
            <Route path="/" element={<Index cookies={cookies} t={t} />} />
            <Route path="/login" element={<Login t={t}/>} />
            <Route path="/devices" element={<Devices t={t}/>} />
            <Route path="/devices/:category" element={<DeviceCategory t={t}/>} />
            <Route path="/users" element={<Users t={t}/>} />
            {cookies.get("user") && cookies.get("user").role === 0 &&
              <>
                <Route path="/admin" element={<Admin t={t} apiURL={apiURL}/>} />
                <Route path="/admin/add-node" element={<AddNode t={t} apiURL={apiURL} />} />  
                <Route path="/admin/nodes" element={<Nodes t={t} apiURL={apiURL} />} />            
                <Route path="/admin/add-company" element={<AddCompany t={t} apiURL={apiURL}/>} />
                <Route path="/rules" element={<Rules />} />
              </>
            } {/* If there is a "user" cookie and if the user is admin */}
            {/* 404 Page */}
            <Route path="/rules" element={<Rules/>} />
            <Route path="*" element={<Typography variant="h1">404</Typography>} />
          </Routes>
        </Main>
      </Box>
    </BrowserRouter>
    );
}

export default App;

