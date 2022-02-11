/* ---------------------------------- React --------------------------------- */
import * as React from 'react';
import {render} from 'react-dom';
import {Route, BrowserRouter, Routes} from 'react-router-dom';

/* ------------------------------- Components ------------------------------- */
import Index from './components/Index';
import Devices from './components/Devices';
import Users from './components/Users';

/* ------------------------------- Material Ui ------------------------------ */
import { styled, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import Login from './components/Login';

/* ---------------------------------- Auth0 --------------------------------- */
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/Navbar';

function App() {

    const drawerWidth = 240;

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
  
    const {user, isAuthenticated, isLoading } = useAuth0();

    const [open, setOpen] = React.useState(false);
    
    
    if (isLoading || !isAuthenticated) {
      return <Login loading={isLoading}/>
    }
    
    return (
      <BrowserRouter>
        {console.log(user)}
        <Navbar setOpen={setOpen} open={open}/>
        <Box sx={{display: 'flex'}}>
          <Main open={open}>
            <DrawerHeader />
            {/* The application router */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/devices" element={<Devices/>} />
              <Route path="/users" element={<Users />} />
            </Routes>
          </Main>
        </Box>
      </BrowserRouter>
    );
}

export default App;

    