/* ---------------------------------- React --------------------------------- */
import * as React from 'react';
import { useEffect } from 'react';
import {Route, BrowserRouter, Routes} from 'react-router-dom';

/* ------------------------------- Components ------------------------------- */
import Index from './components/Index';
import Devices from './components/Devices';
import Users from './components/Users';

/* ------------------------------- Material Ui ------------------------------ */
import { styled, useTheme, Snackbar, Alert } from '@mui/material';
import { Box } from '@mui/system';
import Login from './components/Login';

/* --------------------------------- Cookies -------------------------------- */
import Cookies from 'universal-cookie';

/* ---------------------------------- Auth0 --------------------------------- */
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/Navbar';

function App() {



  const drawerWidth = 240;

  const cookies = new Cookies();

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

  const {user, isAuthenticated, isLoading, logout } = useAuth0();
  const [error, setError] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState({});


  if (isLoading || !isAuthenticated || !cookies.get('userInfo')) {
    return <Login loading={isLoading} cookies={cookies}/>
  }
  let userID;
  if (isAuthenticated) {
    userID = user.sub.split('|')[1];
  }


    return (
      <BrowserRouter>
        <Navbar setOpen={setOpen} open={open} userName={user.name} image={user.picture} logout={logout} cookies={cookies}/>
        <Box sx={{display: 'flex', flexGrow: 1}}>
          <Main open={open}>
            <DrawerHeader />
            <h1>{error}</h1>
            {/* The application router */}
            <Routes>
              <Route path="/" element={<Index cookies={cookies}/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/users" element={<Users />} />
            </Routes>
          </Main>
        </Box>
      </BrowserRouter>
    );
}

export default App;

