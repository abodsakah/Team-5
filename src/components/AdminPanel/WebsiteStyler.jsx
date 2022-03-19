/* ---------------------------------- React --------------------------------- */
import React, {useEffect} from 'react'

/* ----------------------------------- MUI ---------------------------------- */
import {Box, Typography, styled, Button, Divider} from '@mui/material'
import ColorPicker from 'material-ui-color-picker'


function WebsiteStyler({t, apiURL, choosenColor, setChoosenColor, updateStyling, setCompanyLogo}) {

    const [mainColorInput, setMainColorInput] = React.useState(`${choosenColor}`);
    const [fileData, setFileData] = React.useState(null);

    const handleColorChange = (color) => {
        if (color) {
            setMainColorInput(color);
        }
    }

    // useEffect(() => {
    //     setMainColorInput(`${MainColor}`);
    // }, [MainColor]);

    const ColorSample = styled('div')`
        background-color: ${mainColorInput};
        width: 1rem;
        height: 1rem;
        border-radius: 5px;
        padding: 10px;
        margin: 10px;
    `;

    const handleFileData = (e) => {
        if (e.target.files[0]) {
            setFileData(e.target.files[0]);
            setCompanyLogo(e.target.files[0]);
        }
    }

    return (
        <Box p={2}>
            <Typography variant="h3">{t('logo')}</Typography>
            <br />
            <input type={"file"} onChange={handleFileData}/>
            <br />
            <br />
            <Divider />
            <Typography variant="h3">{t('websiteStyling')}</Typography>
            <br />
            <Typography variant="body1">
                {t("websiteStylingDescription")}
            </Typography>
            <br />
            <Typography variant="h5">{t("mainColor")}</Typography>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
            <ColorPicker
                name="mainColor"
                defaultValue={`#${choosenColor}`}
                onChange={(color) => {
                    handleColorChange(color);
                }}
                />
                <ColorSample />
            </Box>
            <br />
            <Button variant="contained" color="primary" onClick={() => {
                // set color withou #
                setChoosenColor(mainColorInput.replace('#', ''));
                updateStyling();
            }} >
                {t("save")}
            </Button>
    </Box>
    
    )
}

export default WebsiteStyler