/* ---------------------------------- React --------------------------------- */
import React from 'react';
import {Link, useNavigate} from 'react-router-dom';

/* ------------------------------- Material UI ------------------------------ */
import { styled, useTheme } from '@mui/material';
import {Toolbar, IconButton, Drawer, Typography, Divider, List, ListItemIcon, ListItem, ListItemText, Box} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

const Menu = () => {

    const drawerWidth = 240;

    const theme = useTheme(); // Get the theme from the context
    const [open, setOpen] = React.useState(false);
    
    const handleDrawerTrigger = () => {
        setOpen(!open);
    };

  
    const navigate = useNavigate();
  
    const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
        ({ theme, open }) => ({
          flexGrow: 1,
          padding: theme.spacing(3),
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: `-${drawerWidth}px`,
          ...(open && {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
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

      const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
      })(({ theme, open }) => ({
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: `${drawerWidth}px`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }),
      }));

    return (
        <Box sx={{display: 'flex'}}>
        <AppBar position='fixed' open={open}>
            <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerTrigger}
                sx={{mr: 2}}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{flexGrow: 1}}>
                Team 5
            </Typography>
            </Toolbar>
        </AppBar>
        <Drawer
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
            },
            }}
            variant='persistent'
            anchor='left'
            open={open}
        >
            <DrawerHeader>
            <IconButton onClick={handleDrawerTrigger}>

                <ChevronLeftIcon />
            </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
            <ListItem button component={Link} to="/">
                <ListItemIcon>
                <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/devices">
                <ListItemIcon>
                <DeviceHubIcon />
                </ListItemIcon>
                <ListItemText primary="Devices" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                <SupervisedUserCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Users" />
            </ListItem>
            </List>
        </Drawer>
        <Main open={open}>
            <DrawerHeader />
            {/* The application router */}
        </Main>
        </Box>
    );
};

export default Menu;
