/* ---------------------------------- React --------------------------------- */
import React from 'react';

/* ------------------------------ React router ------------------------------ */
import {Link} from 'react-router-dom';

/* ----------------------------------- MUI ---------------------------------- */
import { styled, SwipeableDrawer, useTheme } from '@mui/material';
import {Toolbar, IconButton, Drawer, Typography, Divider, List, ListItemIcon, ListItem, ListItemText, Menu, MenuItem, Avatar} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';

/* -------------------------------- MUI Icon -------------------------------- */
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import RuleIcon from '@mui/icons-material/Rule';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import MemoryIcon from '@mui/icons-material/Memory';


const Navbar = ({setOpen, open, logout, image, cookies, t}) => {

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
    
    const drawerWidth = 240;

    const theme = useTheme(); // Get the theme from the context


    const handleDrawerTrigger = () => {
        setOpen(!open); // sets the state of the drawer to the opposite of what it is
    };

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(open);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);


    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const handleLogout = (() => {
        // when the function is called it logs out the user and redirects them to the login page then removes the cookies called "user"
        logout({returnTo: window.location.origin});
        cookies.remove("user");
    });

    return (
    <>
        {/* Navigation bar */}
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
                <Typography variant="h6" sx={{flexGrow: 1}}>Tract</Typography>
                
                {/* User button */}
                <div>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                        id="user-button"  
                    >
                        <Avatar alt="User" src={image} />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        style={{
                            top: '3rem',
                            right: '0',
                            padding: '5rem',
                            left: 'auto',
                        }}
                    >
                        {/* Items in the user menu */}
                        <MenuItem style={{paddingRight: '4rem'}} onClick={handleClose}>{t("profile")}</MenuItem>
                        <MenuItem style={{paddingRight: '4rem'}} onClick={handleLogout}>{t("logout")}</MenuItem>
                    </Menu>
                </div>
                {/* End User Button */}
            </Toolbar>
        </AppBar>
        {/* The drawer that showes up when the menu button is pressed */}
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
            onClose={toggleDrawer(anchorEl, false)}
            onOpen={handleDrawerTrigger}
        >
        <DrawerHeader>
            <IconButton onClick={handleDrawerTrigger}>

            <ChevronLeftIcon />
            </IconButton>
        </DrawerHeader>
        <Divider />
            <List>
                {/* The item list that is showen in the drawer */}
                <ListItem button component={Link} to="/"> {/* Link to where the item leads */}
                <ListItemIcon>
                    <DashboardIcon /> {/* Icon of the item */}
                </ListItemIcon>
                <ListItemText primary={t("dashboard")} /> {/* Text of the item */}
                </ListItem>
                <ListItem button component={Link} to="/devices">
                <ListItemIcon>
                    <DeviceHubIcon />
                </ListItemIcon>
                <ListItemText primary={t("devices")} />
                </ListItem>
                <ListItem button component={Link} to="/users">
                <ListItemIcon>
                    <SupervisedUserCircleIcon />
                </ListItemIcon>
                <ListItemText primary={t("users")} />
                </ListItem>
            </List>
            {cookies.get("user") && Number(cookies.get("user").role) < 2 &&
                <>
                    <Divider />
                    <br />
                    <Typography variant="h6" sx={{textAlign: 'center'}}>{t("admin")}</Typography>
                    <List>
                        {cookies.get("user").role === 0 &&
                            <>
                            <ListItem button component={Link} to="/admin/">
                                <ListItemIcon>
                                    <FeaturedPlayListIcon />
                                </ListItemIcon>
                                <ListItemText primary={t("companies")} />
                            </ListItem>
                            <ListItem button component={Link} to="/admin/nodes/">
                            <ListItemIcon>
                                <MemoryIcon />
                            </ListItemIcon>
                            <ListItemText primary={t("nodes")} />
                            </ListItem>
                            </>
                        }
                    </List>
                    {cookies.get("user").role === 0 &&
                    <>
                    <br/>
                    <Typography variant="h6" sx={{textAlign: 'center'}}>{t("rules")}</Typography>
                    <List>
                        <ListItem button component={Link} to="/rules">
                            <ListItemIcon>
                                <RuleIcon />
                            </ListItemIcon>
                            <ListItemText primary={t("rules")} />
                        </ListItem>
                    </List>
                </>
                }
                </>
            }
            
        </Drawer>
        {/* End Drawer */}
    </>
    )
}

export default Navbar