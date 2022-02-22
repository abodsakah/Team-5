import React from 'react';
import { useParams  } from 'react-router-dom';
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
import Button from '@mui/material/Button';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import IconButton from '@mui/material/IconButton'
import { Popover } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


 
const DeviceCategory = () => {

  let { category } = useParams()
  

  // Tablecontent
  function createData(name, calories, status, carbs, protein) {
    return { name, calories, status, carbs, protein };
  }

  let rows = []
  category === "hissensorer" && (
    rows = [
      createData('hiss Entré 1', 18, 'status', 24, 4.0),
      createData('hiss Entré 2', 237, 'status', 37, 4.3),
      createData('hiss Entré 3', 18, 'status', 24, 4.0),
      createData('hiss Entré 4', 237, 'status', 37, 4.3),
    ]
  )
  category === "temperatursensorer" && (
    rows = [
      createData('temperatursensor 1', 18, 'status', 24, 4.0),
      createData('temperatursensor 2', 237, 'status', 37, 4.3),
      createData('temperatursensor 3', 18, 'status', 24, 4.0),
      createData('temperatursensor 4', 237, 'status', 37, 4.3),
      createData('temperatursensor 5', 18, 'status', 24, 4.0),
      createData('temperatursensor 6', 237, 'status', 37, 4.3),
      createData('temperatursensor 7', 18, 'status', 24, 4.0),
      createData('temperatursensor 8', 237, 'status', 37, 4.3),
    ]
  )
  category === "dörrsensorer" && (
    rows = [
      createData('dörr 1', 18, 'status', 24, 4.0),
      createData('dörr 2', 237, 'status', 37, 4.3),
      createData('dörr 3', 237, 'status', 37, 4.3),
      createData('dörr 4', 18, 'status', 24, 4.0),
      createData('dörr 5', 237, 'status', 37, 4.3),
      createData('dörr 6', 18, 'status', 24, 4.0),
      createData('dörr 7', 237, 'status', 37, 4.3),
      createData('dörr 8', 18, 'status', 24, 4.0),
      createData('dörr 9', 237, 'status', 37, 4.3),
      createData('dörr 10', 237, 'status', 37, 4.3),
    ]
  )


  // Popover settings
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [title, setTitle] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setTitle(event.currentTarget.title)
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const open = Boolean(anchorEl);

  return ( 
    <main>
      <h1 style={{ textTransform: 'capitalize' }}>{category}</h1>
      {/* Add sensor Icon */}
      <Box style = {{ position: 'fixed', bottom: 0, right: 0, zIndex: 2 }} sx={{ '& > :not(style)': { m: 3 } }}>
        <Fab size="large" color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Box>
      {/* Table */}
      <TableContainer component={Paper} style={{boxShadow: 'none', marginBottom: "4em"}} >
        <Table size="small" aria-label="a dense table" style={{ borderCollapse:'separate', borderSpacing: '0 0.7em', boxShadow: 'none' }}>
          <TableBody>
            {rows.map((row) => (
              <TableRow>
                <TableCell component="th" scope="row" style={{ border: 'none', padding: "7px" }} >
                  {/* Card */}
                  <Card sx={{ display: 'flex', border: '1px solid #e0e0e0', textDecoration: 'none', padding: "1em", boxShadow:"5px 5px 5px #F0F0F0" }} >
                    {/* Sensor title */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                      <CardContent sx={{ flex: '1 0 auto', padding: '1em 0' }}>
                        <Typography component="div" variant="h5" sx={{ textTransform: 'capitalize' }} >
                        { row.name }
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                          Lite info <b>{ row.installed }</b>
                        </Typography>
                      </CardContent>
                    </Box>
                    {/* Icons more/status */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', margin: 'auto',  gap: '1em', alignItems:"flex-start"}}>
                      <IconButton title={ row.name } variant="contained" onClick={handleClick} sx={{ width: "fit-content", alignSelf: 'flex-end' }}>
                        <MoreVertRoundedIcon />
                      </IconButton>
                      <div style={{ display: 'flex', flexDirection: 'row', margin: '0 auto', textTransform: 'capitalize', alignSelf: 'flex-end'}} >
                        <p>{ row.status }</p>
                        <CircleRoundedIcon sx={{ fontSize: 20, margin: 'auto', color: 'orange', padding:"0 0.45em" }}>sensorIcon</CircleRoundedIcon>
                      </div>
                    </Box>
                  </Card>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Popover */}
      <div>
        <Popover open={open} title={title} anchorEl={anchorEl} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', margin: '0 auto', padding: "0.5em", alignItems:"flex-start"}}>
            <Button startIcon={<EditIcon />} sx={{ textTransform: 'none' }}>
              Redigera { title }
            </Button>
            <Button startIcon={<DeleteIcon />} sx={{ textTransform: 'none', color: '#EB4440' }}>
              Radera { title }
            </Button>
          </Box>
        </Popover>
      </div> 
    </main>
    );
};



export default DeviceCategory;

