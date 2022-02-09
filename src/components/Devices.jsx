import React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';



const Devices = ({text}) => {

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#FD9F20',
      color: '#E81A76',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: 'white',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  function createData(name, calories, fat, carbs) {
    return { name, calories, fat, carbs};
  }

  const rows = [
    createData('Sensor 1', '23 feb 2020', 0, 'I rullning'),
    createData('Sensor 2', '10 mars 2020', 0, 'I rullning'),
    createData('Sensor 3', '6 jan 2020', 8, 'I rullning'),
    createData('Sensor 5', '3 aug 2020', 3, 'I rullning'),
    createData('Sensor 4', '2 sep 2020', 0, 'I rullning'),
  ];

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

return (
  <main>
    <p>Action/lägga till devices. </p>
    <p>Display över devices, Visa de som har problem? Visa de sensorer som har haft flest problem? Sortera de modeller som behöver extra koll, beroende på statistik/modell?</p>
  
  {/* ADD-BUTTONS */}
  <div style={{ backgroundColor: 'white', padding: '2em', }} >
  <Box style={{ textAlign: 'center' }} sx={{ '& > :not(style)': { m: 1 } }}>
    <Fab color="secondary" aria-label="add">
      <AddIcon />
    </Fab>
    <p>'Tract's färger: </p>
    <Fab style={{ backgroundColor: '#217AE5' }} aria-label="add">
      <AddIcon />
    </Fab>
    <Fab style={{ backgroundColor: '#FD9F20' }} aria-label="add">
      <AddIcon />
    </Fab>
    <Fab style={{ backgroundColor: '#E81A76' }} aria-label="add">
      <AddIcon />
    </Fab>
    <Fab style={{ backgroundColor: '#32CECF', '&:hover': { backgroundColor: '#E81A76' } }} aria-label="add">
      <AddIcon />
    </Fab>
    </Box>
  </div>

  {/* LIST */}
  <div style={{
          backgroundColor: 'blue',
          padding: '2em',
      }}
      >
  <List
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
      }}
    >
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Photos" secondary="Jan 9, 2014" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <WorkIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Work" secondary="Jan 7, 2014" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Vacation" secondary="July 20, 2014" />
      </ListItem>
    </List>
  </div>

  {/* CARD */}
  <div style={{
          backgroundColor: 'green',
          padding: '2em',
      }}
      >
      <Card sx={{ maxWidth: 'fixed' }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography>
        <Typography variant="h5" component="div">
          be{bull}nev{bull}o{bull}lent
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          adjective
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
      </div>

      {/* SECTIONS */}
      <div style={{
          backgroundColor: 'PINK',
          padding: '2em',
      }}>
      <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Flest felsökta" {...a11yProps(0)} />
          <Tab label="Ofta rapporterade" {...a11yProps(1)} />
          <Tab label="Nyligen installerade" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
       {/* TABLE */}
          <TableContainer component={Paper}>
          <Table sx={{ minWidth: 150 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Sensor</StyledTableCell>
                <StyledTableCell align="right">"Installations datum?"</StyledTableCell>
                <StyledTableCell align="right">Antal fel rapporterade?</StyledTableCell>
                <StyledTableCell align="right">Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell component="th" scope="row"> {row.name}</StyledTableCell>
                  <StyledTableCell align="right">{row.calories}</StyledTableCell>
                  <StyledTableCell align="right">{row.fat}</StyledTableCell>
                  <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Box>

      </div>
  </main>
  );

};

export default Devices;
