import * as React from 'react';
import { useEffect, useState } from 'react';
import { CircularProgress, styled, useTheme } from '@mui/material';
import {circularProgress} from '@mui/material';
import Cookies from 'universal-cookie';

export default function Index({cookies}) {

    const [userId, setUserId] = useState('');

    const fetchUserId = async () => {
        console.log('fetchUserId');
        setUserId(cookies.get('userInfo').user_id);
    };

    useEffect(() => {
        fetchUserId();
    }, []);
    

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

            {userId &&
                <h2 style={{
                    color: 'white',
                    textAlign: 'center',
                }}>
                    Your user id is: <span style={{textDecoration: 'underline'}}>{userId}</span>
                </h2>
            }
        </div>  
    )
}

