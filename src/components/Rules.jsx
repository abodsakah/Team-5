import {Button, Divider, FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Select, styled, TextField, Typography, Checkbox, ListItemText, Box, Chip, useTheme, Slider} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import React from 'react'
import AddShoppingCart from '@mui/icons-material/AddShoppingCart';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}


const Rules = () => {
  const theme = useTheme();

  const marks = [
    {
      value: 0,
      label: '0°C',
    },
    {
      value: 20,
      label: '20°C',
    },
    {
      value: 37,
      label: '37°C',
    },
    {
      value: 100,
      label: '100°C',
    },
  ];
  
  const RulesContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    height: '100%',
    padding: '0px 20px',
    backgroundColor: '#fafafa',
  });

  const LeftSide = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    width: '80%'
  });

  const RightSide = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    width: '10%'
  });

  const Center = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  });

  const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
  ];

  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  function valuetext(value) {
    return `${value}°C`;
  }

  function valueLabelFormat(value) {
    return marks.findIndex((mark) => mark.value === value) + 1;
  }

  return (
    <RulesContainer>
      <LeftSide>
        <Typography variant="h2" gutterBottom>Rules for development</Typography>
        <Typography variant="body1" gutterBottom>
          This page is for developers working on this project where we are going to go over the rules and guidelines for both front-end and back-end development.
        </Typography>
        <br />
        <Divider />
        <br />
        <Typography variant="h1" gutterBottom id={"setup"}>Setting up the project</Typography>
        <Typography variant="body1" gutterBottom>
          First after cloning the project, we need to install the dependencies. We can do this by running the following command in the terminal:
        </Typography>
        <Typography variant="body1" gutterBottom>
          <code>npm install</code>
        </Typography>
        <Typography variant="body1" gutterBottom>
          This will install all the dependencies for the project.
        </Typography>
        <Typography variant="body1" gutterBottom>
          After installing the dependencies, we need to setup the environment variables. We can do this by creating a file called <code>env.js</code> in the root directory of the project. This file will contain the environment variables for the project.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <pre>
            <code>
              {`
  DB_HOST= [Database host]
  DB_LOGIN= [Database username]
  DB_PASSWORD= [Database password]
  DB_NAME= [Database name]
  DB_CHAR= utf8mb4
  DB_MULTI= true
  REACT_APP_TRACT_API_KEY= [Tract API key]
              `}
            </code>
          </pre>
        </Typography>
        <br />
        <Divider />
        <br />
        <div id={"frontend"}>
          <Typography variant="h1" gutterBottom>Front-end</Typography>
          <Typography variant="body1" gutterBottom>
            In this section we are going to go throw the rules and guidelines for front-end development.
          </Typography>
          <br />
          <Typography variant="h2" gutterBottom id={'basicelements'}> Basic Elements </Typography>
          <Typography variant="h4" gutterBottom id={"button"}>Buttons</Typography>
          <Typography variant="body1" gutterBottom>
            The buttons that are to be used in this project are going to be devided into text buttons, primary buttons and secondary buttons.
          </Typography>
          <Center>
            <Button style={{margin:'1rem'}} variant="text">Text Button</Button>
            <Button style={{margin:'1rem'}} variant="contained">Primary Button</Button>
            <Button style={{margin:'1rem'}} variant="outlined">Secondary Button</Button>
          </Center>
          <pre style={{border: '.5px black solid', borderRadius: '.5rem'}}>
            <code>
              {`
  <Button variant="text">Text Button</Button>
  <Button variant="contained">Primary Button</Button>
  <Button variant="outlined">Secondary Button</Button>
              `}
            </code>
          </pre>
        </div>
        <Typography variant="h5" gutterBottom id={"buttoncolor"}>Buttons Color</Typography>
        <Typography variant="body1" gutterBottom>
          Buttons can have diffrent colors depending on the state of the button or the meaning of the button.
        </Typography>
        <Center>
          <Button style={{margin: '1rem'}} variant="contained" color="success">Success Button</Button>
          <Button style={{margin: '1rem'}} variant="contained" color="warning">Warning Button</Button>
          <Button style={{margin: '1rem'}} variant="contained" color="error">Error Button</Button>
          <Button style={{margin:'1rem'}} variant="contained" color="info">Info Button</Button>
          <Button style={{margin:'1rem'}} variant="contained" color="primary">Primary Button</Button>
          <Button style={{margin:'1rem'}} variant="contained" color="secondary">Secondary Button</Button>
        </Center>
        <pre style={{border: '.5px black solid', borderRadius: '.5rem'}}>
          <code>
            {`
  <Button variant="contained" color="success">Success Button</Button>
  <Button variant="contained" color="warning">Warning Button</Button>
  <Button variant="contained" color="error">Error Button</Button>
  <Button variant="contained" color="info">Info Button</Button>
  <Button variant="contained" color="primary">Primary Button</Button>
  <Button variant="contained" color="secondary">Secondary Button</Button>
            `}
          </code>
        </pre>
        <Typography variant="h4" gutterBottom id={"buttonsize"}>Buttons Size</Typography>
        <Typography variant="body1" gutterBottom>
          Buttons can have diffrent sizes depending on the state of the button or the meaning of the button.
        </Typography>
        <Center>
          <Button style={{margin:'1rem'}} variant="contained" color="primary" size="small">Small Button</Button>
          <Button style={{margin:'1rem'}} variant="contained" color="primary">Normal Button</Button>
          <Button style={{margin:'1rem'}} variant="contained" color="primary" size="large">Large Button</Button>
        </Center>
        <pre style={{border: '.5px black solid', borderRadius: '.5rem'}}>
          <code>
            {`
  <Button variant="contained" color="primary" size="small">Small Button</Button>
  <Button variant="contained" color="primary">Normal Button</Button>
  <Button variant="contained" color="primary" size="large">Large Button</Button>
            `}
          </code>
        </pre>
        <Typography variant="h4" gutterBottom id={"buttonstatus"}>Buttons status</Typography>
        <Typography variant="body1" gutterBottom>
          Buttons can have diffrent states depending on the state of the button or the meaning of the button.
        </Typography>
        <Center>
          <Button style={{margin:'1rem'}} variant="contained" color="primary">Active Button</Button>
          <Button style={{margin:'1rem'}} variant="contained" color="primary" disabled>Disabled Button</Button>
        </Center>
        <pre style={{border: '.5px black solid', borderRadius: '.5rem'}}>
          <code>
            {`
  <Button variant="contained" color="primary">Active Button</Button>
  <Button variant="contained" color="primary" disabled>Disabled Button</Button>
            `}
          </code>
        </pre>
        <Typography variant="h4" gutterBottom id={"buttonwithicon"}>Buttons With Icon</Typography>
        <Typography variant="body1" gutterBottom>
          Buttons can have diffrent icons depending on the state of the button or the meaning of the button.
        </Typography>
        <Center>
          <IconButton style={{margin:'1rem'}} variant="contained" color="primary" startIcon={<i className="fas fa-user-circle"></i>}><DeleteIcon /></IconButton>
          <IconButton style={{margin:'1rem'}} variant="contained" color="primary" endIcon={<i className="fas fa-user-circle"></i>}><AddShoppingCartIcon /></IconButton>
        </Center>
        <pre style={{border: '.5px black solid', borderRadius: '.5rem'}}>
          <code>
            {`
  <Button variant="contained" color="primary" startIcon={<i className="fas fa-user-circle"></i>}>Icon Button</Button>
  <Button variant="contained" color="primary" endIcon={<i className="fas fa-user-circle"></i>}>Icon Button</Button>
            `}
          </code>
        </pre>
        <Typography variant="h4" gutterBottom id={"buttonwithiconandtext"}>Buttons With Icon and Text</Typography>
        <Typography variant="body1" gutterBottom>
          Buttons can have diffrent icons depending on the state of the button or the meaning of the button.
        </Typography>
        <Center>
          <Button style={{margin:'1rem'}} variant="contained" color="primary" startIcon={<i className="fas fa-user-circle"></i>} startIcon={<DeleteIcon/>}>Icon in the start</Button>
          <Button style={{margin:'1rem'}} variant="contained" color="primary" endIcon={<i className="fas fa-user-circle"></i>} endIcon={<AddShoppingCart />}>Icon in the end</Button>
        </Center>
        <pre style={{border: '.5px black solid', borderRadius: '.5rem'}}>
          <code>
            {`
  <Button variant="contained" color="primary" startIcon={<i className="fas fa-user-circle"></i>}>Icon in the start</Button>
  <Button variant="contained" color="primary" endIcon={<i className="fas fa-user-circle"></i>}>Icon in the end</Button>
            `}
          </code>
        </pre>
        <br />
        <Divider />
        <br />
        <Typography variant="h3" gutterBottom id={"forms"}>Forms</Typography>
        <Typography variant="body1" gutterBottom>
          Forms are used to collect data from the user. and they are an essential part of the web application.
        </Typography>
        <Typography variant="h4" gutterBottom id={"textinputs"}>Text Inputs</Typography>
        <Typography variant="body1" gutterBottom>
          The main variant of the text input that we are going to be using is the outlined text input.
        </Typography>
        <Center>
          <TextField style={{margin: '1rem'}} variant="outlined" label="Text Field" />
        </Center>
        <pre style={{border: '.5px black solid', borderRadius: '.5rem'}}>
          <code>
            {`
  <TextField variant="outlined" label="Text Field" />
            `}
          </code>
        </pre>

        <Typography variant="h5" gutterBottom id={"textinputstates"}>Text Input States</Typography>
        <Typography variant="body1" gutterBottom>
          Text inputs can have diffrent states depending on the state of the text input or the meaning of the text input.
        </Typography>
        <Center>
          <TextField style={{margin: '1rem'}}
            required
            id="outlined-required"
            label="Required"
            defaultValue="Hello World"
          />
          <TextField style={{margin: '1rem'}}
            disabled
            id="outlined-disabled"
            label="Disabled"
            defaultValue="Hello World"
          />
          <TextField style={{margin: '1rem'}}
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
          />
          <TextField style={{margin: '1rem'}}
            id="outlined-read-only-input"
            label="Read Only"
            defaultValue="Hello World"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField style={{margin: '1rem'}}
            id="outlined-number"
            label="Number"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField style={{margin: '1rem'}} id="outlined-search" label="Search field" type="search" />
          <TextField style={{margin: '1rem'}}
            id="outlined-helperText"
            label="Helper text"
            defaultValue="Default Value"
            helperText="Some important text"  
          />
        </Center>
        <pre style={{border: '.5px black solid', borderRadius: '.5rem'}}>
          <code>
            {`
  <TextField style={{margin: '1rem'}}
    required
    id="outlined-required"
    label="Required"
    defaultValue="Hello World"
  />
  <TextField style={{margin: '1rem'}}
    disabled
    id="outlined-disabled"
    label="Disabled"
    defaultValue="Hello World"
  />
  <TextField style={{margin: '1rem'}}
    id="outlined-password-input"
    label="Password"
    type="password"
    autoComplete="current-password"
  />
  <TextField style={{margin: '1rem'}}
    id="outlined-read-only-input"
    label="Read Only"
    defaultValue="Hello World"
    InputProps={{
      readOnly: true,
    }}
  />
  <TextField style={{margin: '1rem'}}
    id="outlined-number"
    label="Number"
    type="number"
    InputLabelProps={{
      shrink: true,
    }}
  />
  <TextField style={{margin: '1rem'}} id="outlined-search" label="Search field" type="search" />
  <TextField style={{margin: '1rem'}}
    id="outlined-helperText"
    label="Helper text"
    defaultValue="Default Value"
    helperText="Some important text"  
  />
          `}
          </code>
        </pre>
        
        <Typography variant="h5" gutterBottom id={"textinputvalidation"}>Text Input validation</Typography>
        <Typography variant="body1" gutterBottom>
          Text inputs should always have text validation to make sure the user is entering the correct information.
        </Typography>
        <Center>
          <TextField style={{margin: '1rem'}}
            error
            id="outlined-error"
            label="Error"
            defaultValue="Hello World"
          />
          <TextField style={{margin: '1rem'}}
            error
            id="outlined-error-helper-text"
            label="Error"
            defaultValue="Hello World"
            helperText="Incorrect entry."
          />
        </Center>
        <pre style={{border: '.5px black solid', borderRadius: '.5rem'}}>
          <code>
            {`
  <TextField
    error
    id="outlined-error"
    label="Error"
    defaultValue="Hello World"
  />
  <TextField
    error
    id="outlined-error-helper-text"
    label="Error"
    defaultValue="Hello World"
    helperText="Incorrect entry."
  />
            `}
          </code>
        </pre>
        <Typography variant="h5" gutterBottom id={"multiline"}>Multi line</Typography>
        <Typography variant="body1" gutterBottom>
          Multiline are text inputs that can be used to enter more than one line of text.
        </Typography>
        <Center>
          <TextField style={{margin: '1rem'}}
            id="outlined-multiline-flexible"
            label="Multiline"
            multiline
            maxRows={4}
          />
          <TextField style={{margin: '1rem'}}
            id="outlined-textarea"
            label="Multiline Placeholder"
            placeholder="Placeholder"
            multiline
          />
          <TextField style={{margin: '1rem'}}
            id="outlined-multiline-static"
            label="Multiline"
            multiline
            rows={4}
            defaultValue="Default Value"
          />
        </Center>
        <pre style={{border: '.5px black solid', borderRadius: '.5rem'}}>
          <code>
            {`
  <TextField
    id="outlined-multiline-flexible"
    label="Multiline"
    multiline
    maxRows={4}
  />
  <TextField
    id="outlined-textarea"
    label="Multiline Placeholder"
    placeholder="Placeholder"
    multiline
  />
  <TextField
    id="outlined-multiline-static"
    label="Multiline"
    multiline
    rows={4}
    defaultValue="Default Value"
  />
            `}
          </code>
        </pre>
        <Typography variant="h4" gutterBottom id={"select"}>Selects</Typography>
        <Typography variant="body1" gutterBottom>
          Selects are used to select a value from a list of options.
        </Typography>
        <Center>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </Center>
        <pre style={{border: '.5px black solid', borderRadius: '.5rem'}}>
          <code>
            {`
  <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Age</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    label="Age"
  >
    <MenuItem value={10}>Ten</MenuItem>
    <MenuItem value={20}>Twenty</MenuItem>
    <MenuItem value={30}>Thirty</MenuItem>
  </Select>
  </FormControl>
          `}
          </code>
        </pre>
        <Typography variant="body1" gutterBottom>
          The <code>FormControl</code> is used to wrap the select so that when we add the <code>InputLabel</code>, it will be displayed above the select.
        </Typography>
        <Typography variant="h5" gutterBottom id={"selecttypes"}>Select Types</Typography>
        <Typography variant="body1" gutterBottom>
          There is multiple types of select that can be used depending on the use case.
        </Typography>
        <Typography variant="h6" gutterBottom id={"selecttypes"}>Checkbox Select</Typography>

        <Center>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={personName.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Center>
        <pre style={{border: '.5px black solid', borderRadius: '.5rem'}}>
          <code>
            {`
  // Outside the render method
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const names = [
      'Oliver Hansen',
      'Van Henry',
      'April Tucker',
      'Ralph Hubbard',
      'Omar Alexander',
      'Carlos Abbott',
      'Miriam Wagner',
      'Bradley Wilkerson',
      'Virginia Andrews',
      'Kelly Snyder',
    ];

    const [personName, setPersonName] = React.useState([]);

    const handleChange = (event) => {
      const {
        target: { value },
      } = event;
      setPersonName(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };

    // in the render method
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={personName}
        onChange={handleChange}
        input={<OutlinedInput label="Tag" />}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={MenuProps}
      >
        {names.map((name) => (
          <MenuItem key={name} value={name}>
            <Checkbox checked={personName.indexOf(name) > -1} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
            `}
          </code>
        </pre>
        <Typography variant="h6" gutterBottom id={"selecttypes"}>Chip Select</Typography>
        <Center>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, personName, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </Center>
        <pre style={{border: '.5px black solid', borderRadius: '.5rem'}}>
          <code>
            {`
  <FormControl sx={{ m: 1, width: 300 }}>
  <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
    <Select
      labelId="demo-multiple-chip-label"
      id="demo-multiple-chip"
      multiple
      value={personName}
      onChange={handleChange}
      input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
      renderValue={(selected) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selected.map((value) => (
            <Chip key={value} label={value} />
          ))}
        </Box>
      )}
      MenuProps={MenuProps}
    >
      {names.map((name) => (
        <MenuItem
          key={name}
          value={name}
          style={getStyles(name, personName, theme)}
        >
          {name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
  `}
          </code>
        </pre>
        <br />
        <Divider />
        <br />
        <Typography variant="h3" gutterBottom id={"valuesliders"}>Value Sliders</Typography>
        <Typography variant="body1" gutterBottom>
          Values slider are sliders that allow you to select a number value from a range.
        </Typography>
        <Typography variant="h5" gutterBottom id={"valuesliders"}>Basic Slider</Typography>
        <Center>
          <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
        </Center>
        <pre style={{border: '.5px black solid', borderRadius: '.5rem'}}>
          <code>
            {`
  <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
            `}
          </code>
        </pre>

        <Typography variant="h5" gutterBottom id={"discretesliders"}>Discrete sliders</Typography>
        <Center>
          <Slider
            aria-label="Temperature"
            defaultValue={30}
            valueLabelDisplay="auto"
            step={10}
            marks
            min={10}
            max={110}
          />
        </Center>
        <pre style={{border: '.5px black solid', borderRadius: '.5rem'}}>
          <code>
            {`
  <Slider
    aria-label="Temperature"
    defaultValue={30}
    valueLabelDisplay="auto"
    step={10}
    marks
    min={10}
    max={110}
  />
            `}
          </code>
        </pre>
        <br />
        <Center>
          <Slider
            aria-label="Restricted values"
            defaultValue={20}
            valueLabelFormat={valueLabelFormat}
            getAriaValueText={valuetext}
            step={null}
            valueLabelDisplay="auto"
            marks={marks}
          />
        </Center>
        <pre style={{border: '.5px black solid', borderRadius: '.5rem'}}>
          <code>
            {`
  const Rules = () => {
    const names = [
      'Oliver Hansen',
      'Van Henry',
      'April Tucker',
      'Ralph Hubbard',
      'Omar Alexander',
      'Carlos Abbott',
      'Miriam Wagner',
      'Bradley Wilkerson',
      'Virginia Andrews',
      'Kelly Snyder',
    ];
    function valuetext(value) {
      return value + "°C";
    }

    function valueLabelFormat(value) {
      return marks.findIndex((mark) => mark.value === value) + 1;
    }

    return(
      <Slider
              aria-label="Restricted values"
              defaultValue={20}
              valueLabelFormat={valueLabelFormat}
              getAriaValueText={valuetext}
              step={null}
              valueLabelDisplay="auto"
              marks={marks}
      />
    )
  }
  `}
          </code>
        </pre>

        <br />
        <Divider />
        <br />
        <Typography variant="h1" gutterBottom id={"backend"}>Back-end</Typography>
        <Typography variant="body1" gutterBottom>
          The back-end is the part of the application and how everything works.
        </Typography>
        <Typography variant="h3" gutterBottom id={"api"}>API</Typography>
        <Typography variant="body1" gutterBottom>
          The way the front end communicates with the back end is through an API. All the API files are located in the <code>API</code> folder. The API folder also contains the <code>index.js</code> file and the <code>/src</code> directory.
          <br />
          <br />

          The <code>index.js</code> file is the entry point of the API. It is the file that is called when the application is run. It is the file that is responsible for setting up the server and the routes.
          <br />
          <br />

          The <code>/src</code> directory contains all the files that are used to create the API.
          <br />
          <br />
          The <code>/src/dbConnection.js</code> file is the file that is responsible for connecting to the database and getting the information needed from the database.
        </Typography>
        <br />
        <Typography variant="h3" gutterBottom id={"callingapi"}>Calling the API from the front-end</Typography>
        <Typography variant="body1" gutterBottom>
          The front-end calls the API by using a simple fetch call. where in the fetch call you can pass the route that you want to call and then the API key and the data that you want to send to the API as a query.
          </Typography>
      </LeftSide>
      <Divider orientation="vertical" variant="middle" flexItem />
      <RightSide>
        <div style={{
          position: 'fixed',
          top: '30%',
          right: '3%',
        }}>
          <Typography variant="h3" gutterBottom>Table of content</Typography>
          <Typography variant="body1" gutterBottom>
            <ul>
              <li>
                <a href="#top">About this</a>
              </li>
              <li>
                <a href="#setup">Setting Up The Project</a>
              </li>
              <li>
                <a href="#frontend">Front-end</a>
              </li>
              <ul>
                <li>
                  <a href="#basicelements">Basic Elements</a>
                </li>
                <ul>
                  <li>
                    <a href="#button">Button</a>
                  </li>
                  <ul>
                    <li>
                      <a href="#buttoncolor">Button Color</a>
                    </li>
                    <li>
                      <a href="#buttonsize">Button Size</a>
                    </li>
                    <li>
                      <a href="#buttonstatus">Button Status</a>
                    </li>
                    <li>
                      <a href="#buttonwithicon">Button With Icon</a>
                    </li>
                    <li>
                      <a href="#buttonwithiconandtext">Button With Icon and Text</a>
                    </li>
                  </ul>
                  <li>
                    <a href="#forms">Forms</a>
                  </li>
                    <ul>
                      <li>
                        <a href="#textinputs">Text Inputes</a>
                      </li>
                      <ul>
                        <li>
                          <a href="#textinputstates">Text Inputs States</a>
                        </li>
                        <li>
                          <a href="#textinputvalidation">Text Inputs Validation</a>
                        </li>
                        <li>
                          <a href="#multiline">Multiline</a>
                        </li>
                      </ul>
                  </ul>
                  <li>
                    <a href="#select">select</a>
                  </li>
                  <ul>
                    <li>
                      <a href="#selecttypes">Select Types</a>
                    </li>
                  </ul>
                  <li>
                    <a href="#slider">Slider</a>
                  </li>
                  <ul>
                    <li>
                      <a href="#discretesliders">Discrete Sliders</a>
                    </li>
                  </ul>
                </ul>
              </ul>
              <li>
                <a href="#backend">Back-end</a>
              </li>
              <ul>
                <li>
                  <a href="#api">API</a>
                </li>
                <ul>
                  <li>
                    <a href="#callingapi">Calling the API from the front-end</a>
                  </li>
                </ul>
              </ul>
            </ul>
            </Typography>
          </div>
      </RightSide>
    </RulesContainer>
  )
}

export default Rules