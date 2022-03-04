import {CircularProgress, styled, Typography} from '@mui/material'
import React from 'react'

function LoadingOverlay({loading}) {

    const Overlay = styled('div')`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `

    return (
        <>
            {loading &&
                <Overlay>
                    <CircularProgress />
                    <Typography variant="h6" color={"white"}>Loading...</Typography>
                </Overlay>
            }
        </>
    )
}

export default LoadingOverlay