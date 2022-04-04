/* ---------------------------------- React --------------------------------- */
import * as React from 'react';

/* ------------------------------ React Router ------------------------------ */
import {Link} from 'react-router-dom';

/* ----------------------------------- MUI ---------------------------------- */
import { DataGrid } from '@mui/x-data-grid';
import { Avatar, Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const columns = [
  {
    field: 'avatar',
    headerName: 'Avatar',
    width: 80,
    editable: false,
    renderCell: (params) => <Avatar alt={params.value} src={params.value} sx={{ bgcolor: '#ee6666' }} />
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: true,
  },
  {
    field: 'mail',
    headerName: 'Mail',
    width: 250,
    editable: true,
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 150,
    editable: true,
  },
  
];

const rows = [
  { id: 1, avatar: 'Harold Williamson', name: 'Harold Williamson', mail: 'japcof@unepaz.au', role: 'Admin'},
  { id: 2, avatar: 'Jason Hicks', name: 'Jason Hicks', mail: 'boh@fibbafbic.nl', role: 'Admin'},
  { id: 3, avatar: 'Stella Andrews', name: 'Stella Andrews', mail: 'ewo@alwa.no', role: 'Admin'},
  { id: 4, avatar: 'Joseph Roberts', name: 'Joseph Roberts', mail: 'gatje@gabec.ec', role: 'Admin'},
  { id: 5, avatar: 'Andrew Gregory', name: 'Andrew Gregory', mail: 'wi@hi.fo', role: 'Admin'},
  { id: 6, avatar: 'Fannie Long', name: 'Fannie Long', mail: 'vu@afgifak.bs', role: 'Admin'},
  { id: 7, avatar: 'Harold Williamson', name: 'Harold Williamson', mail: 'japcof@unepaz.au', role: 'Admin'},
  { id: 8, avatar: 'Jason Hicks', name: 'Jason Hicks', mail: 'boh@fibbafbic.nl', role: 'Admin'},
  { id: 9, avatar: 'Stella Andrews', name: 'Stella Andrews', mail: 'ewo@alwa.no', role: 'Admin'},
  { id: 10, avatar: 'Joseph Roberts', name: 'Joseph Roberts', mail: 'gatje@gabec.ec', role: 'Admin'},
  { id: 11, avatar: 'Andrew G', name: 'Andrew Gregory', mail: 'wi@hi.fo', role: 'Admin'},
  { id: 12, avatar: 'Fannie Long', name: 'Fannie Long', mail: 'vu@afgifak.bs', role: 'Admin'}
];

const UserList = ({}) => {
  return (
    <main>
      <h1>'Företaget's adminpanel</h1>
      <Box style={{height: '550px', width: '100%'}} className="mt-7">
        <Box style = {{ position: 'fixed', bottom: 0, right: 0 }} sx={{ '& > :not(style)': { m: 3 } }}>
          <Fab size="large" color="primary" aria-label="add" component={Link} to={'/admin/users/add'} >
            <AddIcon />
          </Fab>
        </Box>
        <DataGrid 
          sx={{
            boxShadow:"5px 5px 5px #F0F0F0",
            border: '1px solid #e0e0e0',
            overflowY: 'scroll'
          }}
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          checkboxSelection
        />
      </Box>
    </main>
  );
}


export default UserList;


