import React, {useEffect} from 'react';
import { useParams  } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Link } from 'react-router-dom';
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
import TextField from '@mui/material/TextField';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


 
const DeviceCategory = ({user, t, apiURL}) => {
  let {category} = useParams()

  const [type, setType] = React.useState(0);

  if (type === 0) {
    if (category === t("tempSensor")) {
      setType(1);
    } else if (category === t("analogSensor")) {
      setType(3);
    } else if (category === t("switchSensor")) {
      setType(2);
    }
  }

  const [rows, setRows] = React.useState([]);

  // Tablecontent
  function createData(name, calories, status, carbs, protein) {
    return {name, calories, status, carbs, protein};
  }

  const getData = () => {
    const params = new FormData();
    params.append('key', process.env.REACT_APP_TRACT_API_KEY);
    params.append('companyId', user.company_id);
    params.append('type', type);
    
    fetch(`${apiURL}/getNodesOfType`, {
      method: 'POST',
      body: params
    }).then(res => res.json()).then(res => {
      setRows(Object.values(res))
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    getData();
  }, [])


   // Dialog 
   const [openDialog, setOpenDialog] = React.useState(false);
   const [titleDialog, setTitleDialog] = React.useState(null);
   const handleOpenDialog = (event) => {
     setTitleDialog(event.currentTarget.title)
     setOpenDialog(true);
     setAnchorEl(null);
   };
   const handleCloseDialog = () => {
     setOpenDialog(false);
   };


  // Popover
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [nodeId, setNodeId] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setTitle(event.currentTarget.title)
    setNodeId(event.currentTarget.id)
  };
  const handleClose = () => setAnchorEl(null);
  const openPopover = Boolean(anchorEl);



  return ( 
    <main>
      <Typography variant="h4">
        {category}
      </Typography>
      {/* Add sensor Icon */}
      <Box style = {{ position: 'fixed', bottom: 0, right: 0 }} sx={{ fontSize: 25, padding: '1rem', marginBottom: '1rem', '& > :not(style)': { m: 1 } }}>
        <Fab variant="extended" size="large" color="primary"  aria-label="add" component={Link} to={'/devices/add-sensor'} >
          <AddIcon />{t("addSensor")}
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
                  <Card sx={{ display: 'flex', border: '1px solid #e0e0e0', textDecoration: 'none', padding: "0.5em 1em", boxShadow:"5px 5px 5px #F0F0F0" }} >
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
                      <IconButton title={ row.name } variant="contained" onClick={handleClick} id={row.id} sx={{ width: "fit-content", alignSelf: 'flex-end' }}>
                        <MoreVertRoundedIcon />
                      </IconButton>
                      <Box style={{ display: 'flex', flexDirection: 'row', margin: '0 auto', textTransform: 'capitalize', alignSelf: 'flex-end'}} >
                        <Typography variant="subtitle2" color="text.secondary" component="div">
                          { row.status }
                        </Typography>
                        {row.status === "ACTIVE" ? 
                          <CircleRoundedIcon sx={{fontSize: 20, margin: 'auto', color: 'green', padding: "0 0.45em"}} />
                          :
                          row.status === "REPORTED" ?
                            <CircleRoundedIcon sx={{fontSize: 20, margin: 'auto', color: 'red', padding: "0 0.45em"}} />
                            :
                          row.status === "SETUP" ?
                            <CircleRoundedIcon sx={{fontSize: 20, margin: 'auto', color: 'orange', padding: "0 0.45em"}} />
                            :
                            row.status === "INACTIVE" &&
                            <CircleRoundedIcon sx={{fontSize: 20, margin: 'auto', color: 'red', padding: "0 0.45em"}} />
                          
                        }
                      </Box>
                    </Box>
                  </Card>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Popover */}
      <Popover open={openPopover} title={ title } anchorEl={anchorEl} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', margin: '0 auto', padding: "0.5em", alignItems:"flex-start"}}>
          <Button component={Link} to={"/devices/editNodeThreshold/" + nodeId} title={ title } startIcon={<EditIcon />} sx={{ textTransform: 'none' }}>
            {t("edit")} { title }
          </Button>
          <Button startIcon={<DeleteIcon />} sx={{ textTransform: 'none', color: '#EB4440' }}>
            {t("delete")} { title }
          </Button>
        </Box>
      </Popover>
      {/* Dialog */}
      <Dialog
        open={openDialog}
        title={titleDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center', paddingTop: '1em', textTransform: 'capitalize'}}>
          { title }
          <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: '0.6em 0 1em'}} >
            <CircleRoundedIcon sx={{ fontSize: 20, color: 'orange', padding: '0 0.3em'}}>sensorIcon</CircleRoundedIcon>
            <Typography variant="subtitle2" color="text.secondary" component="div">
              Status
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Form */}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Ändra namn på sensor"
            type="name"
            variant="outlined"
            placeholder={ title }
            fullWidth
            autoComplete="off"
          />
        </DialogContent>
        <DialogActions style={{ marginTop: "2em" }}>
          <Button onClick={handleCloseDialog} variant="outlined" startIcon={<CloseIcon />}>
            Avbryt
          </Button>
          <Button onClick={handleCloseDialog} variant="contained" startIcon={<CheckIcon />} sx={{ bgcolor: "#0C3B69", fontWeight:"bold", marginLeft: "1em" }}>
            Spara
          </Button>
        </DialogActions>
      </Dialog>
    </main>
    );
};



export default DeviceCategory;

