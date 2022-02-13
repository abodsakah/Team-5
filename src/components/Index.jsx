import {CircularProgress, Typography} from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';

export default function Index({cookies}) {

    // const [userId, setUserId] = useState('');

    // const fetchUserId = async () => {
    //     console.log('fetchUserId');
    //     setUserId(cookies.get('user').user_id);
    // };

    // useEffect(() => {
    //     fetchUserId();
    // }, []);
    

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

            <h2 style={{
                color: 'white',
                textAlign: 'center',
            }}>
                Your user id is: <span style={{textDecoration: 'underline'}}>{cookies.get("user") ? cookies.get("user").user_id : <CircularProgress/>}</span>
            </h2>
        </div>  
    )
}

