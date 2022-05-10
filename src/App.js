/* ---------------------------------- React --------------------------------- */
import * as React from 'react';
import { useCallback, useState, useEffect } from 'react';
import {Route, BrowserRouter, Routes} from 'react-router-dom';

/* ------------------------------- Components ------------------------------- */
import Index from './components/Index';
import Devices from './components/Devices';
import DeviceCategory from './components/DeviceCategory';
import AddSensor from './components/QrScan';
import AddUser from './components/AddUser';
import Companies from './components/AdminPanel/Companies';
import AddCompany from './components/AdminPanel/AddCompany';
import AddNode from './components/AdminPanel/AddNode';
import Nodes from './components/AdminPanel/Nodes';
import Navbar from './components/Navbar';
import UserList from './components/UserList';
import Login from './components/Login';
import EditCompany from './components/AdminPanel/EditCompany';
import EditNodeThreshhold from './components/EditNodeThreshold';

/* ------------------------------- Material Ui ------------------------------ */
import { styled, Typography, createTheme, ThemeProvider } from '@mui/material';
import { Box } from '@mui/system';

/* --------------------------------- Cookies -------------------------------- */
import Cookies from 'universal-cookie';

/* ---------------------------------- Auth0 --------------------------------- */
import { useAuth0 } from '@auth0/auth0-react';

/* ------------------------------- Translation file ------------------------------- */
import {t, setLang} from './translator'

/* ---------------------------------- Axios --------------------------------- */
import axios from 'axios';

function App() {
  
  // let apiURL = "https://api.abodsakka.xyz/api/v1"; // The url where the api is going to be called (server)
  let apiURL = "http://localhost:9000/api/v1"; // The url where the api is going to be called (local)

  const drawerWidth = 240; // the width of the drawer

  setLang(navigator.language); // Set the language to the browser language
  
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
  const [company, setCompany] = useState({}); // set drawer state
  const [companyStyling, setCompanyStyling] = useState({}); // set drawer state
  const [getStyling, setGetStyling] = useState(true); // set drawer state
  const [MainColor, setMainColor] = useState('4287f5'); // set drawer state
  const [choosenColor, setChoosenColor] = useState(``); // set drawer state
  const [companyLogo, setCompanyLogo] = useState(``); // set drawer state

  const theme = createTheme({
    palette: {
      primary: {
        main: `#${MainColor}`,
      }
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                   ENABLE WHEN DEBUGING OR WORKING LOCALY                   */
  /* -------------------------------------------------------------------------- */
  if (cookies.get('user') === undefined) { // if there is no "user" cookie
    let userID;
    if (isAuthenticated) { // only when the user is authenticated we set the cookie
      try {
        userID = user.sub.split('|')[1]; // get the user id from the user object
        fetch(`${apiURL}/user?key=${process.env.REACT_APP_TRACT_API_KEY}&id=${userID}`).then(res => res.json()).then(data => {
          cookies.set('user', data, {path: '/'}); // set the cookie
          setUserData(data); // set the user data
          return data; // return the user data to update the DOM
        });
      } catch (error) {
        console.log(`Error: ${error}`);
      }

    }
  }

  if (getStyling && isAuthenticated) { // if there is no "companyStyling" cookie
    if (cookies.get('user') !== undefined) {
      let data = new FormData();
      data.append('key', process.env.REACT_APP_TRACT_API_KEY);
      data.append('id', cookies.get('user').id);

      axios.post(`${apiURL}/getCompanySettings`, data).then(res => {
        let data = res.data;
        if (companyStyling.color !== undefined || companyStyling.color !== "") {
          setCompanyStyling(data);
          setMainColor(data.color);
          setChoosenColor(data.color);
          setGetStyling(false);
        }
        return data; // return the user data to update the DOM
      });

      // fetch(`${apiURL}/getCompanySettings?key=${process.env.REACT_APP_TRACT_API_KEY}&id=${cookies.get('user').company_id}`).then(res => res.json()).then(data => {
        
      // });
    }
  }

  useEffect(() => {
    updateStyling();
  }, [choosenColor]);

  const updateStyling = () => {
    if (cookies.get('user') !== undefined && choosenColor !== '') {
      let data = new FormData();

      data.append('key', process.env.REACT_APP_TRACT_API_KEY);
      data.append('id', cookies.get('user').company_id);
      data.append('color', choosenColor);
      data.append('logo', companyLogo);
      axios.post(`${apiURL}/updateStyling`, data).then(res => {
        setGetStyling(true);
        setMainColor(choosenColor);
        return res;
      }).catch(err => {
        console.log(err);
      });
    }
  };


  // if the application is loading or the user is not authenticated, render the login page
  if (isLoading || !isAuthenticated) {
    return <Login loading={isLoading} cookies={cookies}/>
  }


  return (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Navbar companyLogo={companyStyling.logo} companyName={companyStyling.name} setOpen={setOpen} open={open} userName={user.name} image={user.picture} logout={logout} cookies={cookies} t={t} apiURL={apiURL} />
      <Box sx={{display: 'flex', flexGrow: 1}} style={{height: '100vh'}}>
        <Main open={open}>
          <DrawerHeader />
          <h1>{error}</h1>
          {/* The application router */}
          <Routes>
            <Route path="/" element={<Index cookies={cookies} t={t}  />} />
            <Route path="/login" element={<Login t={t} />} />
            <Route path="/devices" element={<Devices t={t} apiURL={apiURL} user={cookies.get("user")}/>} />
            <Route path="/devices/:category" element={<DeviceCategory t={t} user={cookies.get("user")} apiURL={apiURL}/>} />
            <Route path="/devices/add-sensor" element={<AddSensor t={t} apiURL={apiURL} user={cookies.get("user")}/>} />
            <Route path="/devices/editNodeThreshold/:id" element={<EditNodeThreshhold t={t} apiURL={apiURL} user={cookies.get("user")}/>} />
            {cookies.get("user") && cookies.get("user").role <= 1 &&
              <>
                {cookies.get("user") && cookies.get("user").role === 0 &&
                <>
                  <Route path="/admin/companies" element={<Companies t={t} apiURL={apiURL} />} />
                  <Route path="/admin/edit-company/:id" element={<EditCompany t={t} apiURL={apiURL} />} />
                  <Route path="/admin/add-node" element={<AddNode t={t} apiURL={apiURL} />} />
                  <Route path="/admin/nodes" element={<Nodes t={t} apiURL={apiURL} />} />
                  <Route path="/admin/add-company" element={<AddCompany t={t} apiURL={apiURL} />} />
                  <Route path="/admin/users" element={<UserList t={t} apiURL={apiURL} user={cookies.get('user')}/>} />
                  <Route path="/admin/users/add" element={<AddUser t={t} />} />
                  <>{ /*LÄGG HÄR*/ }</>
                </>
              }
              </>
            } 
            {/* If there is a "user" cookie and if the user is admin */}
            {/* 404 Page */}
            <Route path="*" element={<Typography variant="h1">404</Typography>} />
          </Routes>
        </Main>
      </Box>
    </BrowserRouter>
  </ThemeProvider>
  );
}

export default App;

