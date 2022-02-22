import React from 'react';
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import SensorsIcon from '@mui/icons-material/Sensors';


// Tablecontent
function createData(category, installed) {
  return { category, installed};
}

const rows = [
  createData('hissensorer', 4),
  createData('temperatursensorer', 8),
  createData('dörrsensorer', 10)
];


const Devices = ({text}) => {
  return (
    <main>
      <h1>'Företaget's sensorer</h1>
      {/* Add sensor Icon */}
      <Box style = {{ position: 'fixed', bottom: 0, right: 0 }} sx={{ '& > :not(style)': { m: 3 } }}>
        <Fab size="large" color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} style={{boxShadow: 'none'}} >
        <Table size="small" aria-label="a dense table" style={{ borderCollapse:'separate', borderSpacing: '0 0.7em', boxShadow: 'none' }}>
          <TableBody>
            {rows.map((row) => (
              <TableRow>
                <TableCell component="th" scope="row" style={{ border: 'none', padding: '7px' }} >
                  {/* Card */}
                  {/* Redirect link */}
                  <Card component={Link} to={'/devices/' + row.category} sx={{ display: 'flex', border: '1px solid #F0F0F0', textDecoration: 'none', padding: "0.5em", boxShadow:"5px 5px 5px #e0e0e0", gap:"0.5em" }} >
                    {/* SensorIcon */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content', margin: 'auto 0', padding: '1em'}}>
                      <SensorsIcon sx={{ fontSize: 30, margin: '0 auto', color: 'black', backgroundColor: '#F0F0F0', borderRadius: '50%', padding: '0.2em' }}>sensorIcon</SensorsIcon>
                    </Box>
                    {/* Category and installed text */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                      <CardContent sx={{ flex: '1 0 auto', padding: '1em 0' }}>
                        <Typography component="div" variant="h5" sx={{ textTransform: 'capitalize', color: '#020e33'   }} >
                        { row.category }
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ color: 'black'  }}>
                          Antal installerade sensorer: <b>{ row.installed }</b>
                        </Typography>
                      </CardContent>
                    </Box>
                  </Card>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </main>
    );
};


export default Devices;


// import React from 'react';

// const Devices = ({text}) => {
  
//   return (
//     <main>
//     </main>
//     );
// };

// export default Devices;