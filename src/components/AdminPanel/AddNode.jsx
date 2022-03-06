import React from 'react'
import {Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, styled, TextField, Typography} from '@mui/material';
import QrReader from 'react-qr-scanner'

class Scanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            delay: 500,
            result: 'No result',
        };
        this.handleScan = this.handleScan.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    handleScan(data) {
        if (data) {
            this.setState({
                result: data
            });
        }
    }

    handleError(err) {
        console.error(err);
    }

    render() {
        const previewStyle = {
            height: '100%',
            width: '100%',
            borderRadius: '1rem',
        }

        return (
            <Box>
                {/* The Qr reader component */}
                <QrReader
                    delay={this.state.delay}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={previewStyle}
                    facingMode="rear"
                />
                <p>{this.state.result !== null && this.state.result.text}</p>
            </Box>
        )
    }
}

    const QrContainer = styled("div")`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 30%;
        width: 30%;
        @media (max-width: 600px) {
            height: 100%;
            width: 100%;
        }
        `

function AddNode({t, apiURL}) {

    const [nodeType, setNodeType] = React.useState(''); // the type that is choosen
    const [company, setcompany] = React.useState(''); // the company that is choosen
    const [companies, setCompanies] = React.useState([]); // the companies that are available

    const handleNodeTypeChange = (event) => { // when the node type is changed
        setNodeType(event.target.value);
    }
 
    const handleCompanyChange = (event) => { // the company that is choosen
        setcompany(event.target.value); 
    }

    if (companies.length === 0) {
        fetch(`${apiURL}getCompnies?key=${process.env.REACT_APP_TRACT_API_KEY}`)
            .then(res => res.json())
            .then(
                (result) => {
                    setCompanies(result);
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <QrContainer>
                <Typography variant="h4" gutterBottom>Scan Qr to add node</Typography>
                <Scanner/>
            </QrContainer>
            <div>
            <Typography variant="h5" gutterBottom>Node sensor type</Typography>

                <FormControl fullWidth>
                    <InputLabel style={{backgroundColor: "white"}} id="node-type">Node type</InputLabel>
                    <Select
                        labelId='node-type'
                        id='node-type'
                        value={nodeType}
                        onChange={handleNodeTypeChange}
                    >
                        <MenuItem value={1}>Temperature</MenuItem>
                        <MenuItem value={2}>Humidity</MenuItem>
                        <MenuItem value={3}>Switch</MenuItem>
                        <MenuItem value={4}>Wheel thingy (i dont remember the name)</MenuItem>
                    </Select>
                </FormControl>
                <br /><br />
                <Typography variant="h5" gutterBottom>Company of node</Typography>
                <FormControl fullWidth>
                    {companies.length > 0 ?
                        <>
                            <InputLabel style={{backgroundColor: "white"}} id='company-id'>Company</InputLabel>
                            <Select
                                labelId='company-id'
                                id='company-id'
                                value={company}
                                onChange={handleCompanyChange}
                            >
                                {companies.map(company => (
                                    <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
                                ))}
                            </Select>
                        </>
                        :
                        <CircularProgress/>
                    }
                </FormControl>
            </div>
        </Box>
    )
}

export default AddNode