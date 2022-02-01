import * as React from 'react';
import { styled, useTheme } from '@mui/material';
import {Toolbar, IconButton, Drawer, Typography, Divider, List, ListItemIcon, ListItem, ListItemText, Box, Accordion, AccordionSummary, AccordionDetails} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Index() {

    let text = 'Hello World';
    return (
        <div style={{
            backgroundColor: 'red',
            padding: '10px',
        }}>

            <h1 style={{
                color: 'white',
                textAlign: 'center',
            }}
            
            >{text}</h1>
        </div>
    )
}

