import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress, Typography, Box, CardContent, Card, Paper, TableRow, TableContainer, TableCell, TableBody, Table } from '@mui/material';
import Fab from '@mui/material/Fab';

/* -------------------------------- MUI Icons ------------------------------- */
import AddIcon from '@mui/icons-material/Add';
import SensorsIcon from '@mui/icons-material/Sensors';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
// Tablecontent
function createData(category, amount, icon) {
  return { category, amount, icon };
}


const Devices = ({t, apiURL, user}) => {

  const [amountTempSensor, setAmountTempSensor] = React.useState(0);
  const [amountAnalogSensor, setAmountAnalogSensor] = React.useState(0);
  const [amountSwitchSensor, setAmountSwitchSensor] = React.useState(0);

  const [rows, setRows] = React.useState([]);

  const getAmountSensors = async () => {
    const tempSensors = await fetch(`${apiURL}getLogicalDeviceTypeAmount?key=${process.env.REACT_APP_TRACT_API_KEY}&type=temp-humidity&companyId=${user.company_id}"`);
    const analogSensor = await fetch(`${apiURL}getLogicalDeviceTypeAmount?key=${process.env.REACT_APP_TRACT_API_KEY}&type=analog-wheel&companyId=${user.company_id}`);
    const switchSensor = await fetch(`${apiURL}getLogicalDeviceTypeAmount?key=${process.env.REACT_APP_TRACT_API_KEY}&type=switch&companyId=${user.company_id}`);
    
    const tempSensorsData = await tempSensors.json();
    const analogSensorData = await analogSensor.json();
    const switchSensorData = await switchSensor.json();
    
    setAmountTempSensor(parseInt(tempSensorsData.amount));
    setAmountAnalogSensor(parseInt(analogSensorData.amount));
    setAmountSwitchSensor(parseInt(switchSensorData.amount));
  }



  useEffect(() => {
    getAmountSensors();

    setRows([
      createData(t("tempSensor"), amountTempSensor, <DeviceThermostatIcon />),
      createData(t("analogSensor"), amountAnalogSensor, <CandlestickChartIcon />),
      createData(t("switchSensor"), amountSwitchSensor, <ToggleOnIcon />),
    ]);
  }, [amountTempSensor, amountAnalogSensor, amountSwitchSensor]);

  return (
    <>
      {rows !== undefined ? (
      <main>
          <h1>{t("sensors")}</h1>
        {/* Add sensor Icon */}
        <Box style = {{ position: 'fixed', bottom: 0, right: 0 }} sx={{ '& > :not(style)': { m: 3 } }}>
          <Fab size="large" color="primary" aria-label="add" component={Link} to={'/devices/add-sensor'} >
            <AddIcon />
          </Fab>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} style={{boxShadow: 'none'}} >
          <Table size="small" aria-label="a dense table" style={{ borderCollapse:'separate', borderSpacing: '0 0.7em', boxShadow: 'none' }}>
            <TableBody>
                {rows.map((row) => (
                  <>
                  {row.amount > 0 && (
                    <TableRow>
                      <TableCell component="th" scope="row" style={{ border: 'none', padding: '7px' }} >
                        {/* Card */}
                        {/* Redirect link */}
                        <Card component={Link} to={'/devices/' + row.category} sx={{ display: 'flex', border: '1px solid #F0F0F0', textDecoration: 'none', padding: "0.5em", boxShadow:"5px 5px 5px #e0e0e0", gap:"0.5em" }} >
                          {/* SensorIcon */}
                          <Box sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content', margin: 'auto 0', padding: '1em'}}>
                            {/* <SensorsIcon sx={{ fontSize: 30, margin: '0 auto', color: 'black', backgroundColor: '#F0F0F0', borderRadius: '50%', padding: '0.2em' }}>sensorIcon</SensorsIcon> */}
                            {row.icon}
                          </Box>
                          {/* Category and installed text */}
                          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                            <CardContent sx={{ flex: '1 0 auto', padding: '1em 0' }}>
                              <Typography component="div" variant="h5" sx={{ textTransform: 'capitalize' }} >
                              { row.category }
                              </Typography>
                              <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ color: 'black'  }}>
                                Antal installerade sensorer: <b>{ row.amount }</b>
                              </Typography>
                            </CardContent>
                          </Box>
                        </Card>
                      </TableCell>
                    </TableRow>
                      )}
                    </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </main>
      ) : (
        <CircularProgress />
      )}
      </>
    );
};


export default Devices;

