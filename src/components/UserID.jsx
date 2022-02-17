import {CircularProgress, Typography} from '@mui/material';
import * as React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';



export default function Användare({cookies}) {
    let text = 'Välkommen';

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '10px',
        }}>

            <h1 style={{
                color: 'black',
                textAlign: 'center',
            }}
            
            >{text}</h1>

            <h2 style={{
                color: 'black',
                textAlign: 'center',
            }}>
                ID Användare:   <AccountCircleIcon /> <span style={{textDecoration: 'underline'}}>{cookies.get("user") ? cookies.get("user").user_id : <CircularProgress/>}</span>
            </h2>
        </div>
    )
}
