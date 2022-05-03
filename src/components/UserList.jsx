/* ---------------------------------- React --------------------------------- */
import * as React from 'react';
import { useEffect } from 'react';

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
    editable: false,
  },
  {
    field: 'mail',
    headerName: 'Mail',
    width: 250,
    editable: false,
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 150,
    editable: false,
  },
  
];


const UserList = ({t, apiURL, user}) => {
  
  const [rows, setRows] = React.useState([]);

  const fetchUsers = async () => {
    const response = await fetch(`${apiURL}getUsersForCompany?key=${process.env.REACT_APP_TRACT_API_KEY}&companyId=${user.company_id}`);
    const data = await response.json();
    for (let item of Object.values(data)) {
      if (!rows.includes(item)) {
        setRows(rows => [...rows, {
          id: item.id,
          avatar: `${item.first_name} ${item.last_name}`,
          name: `${item.first_name} ${item.last_name}`,
          mail: item.email,
          role: item.role,
        }]);
      }
    }
  }

  useEffect(() => {
    setRows([]);
    fetchUsers();
  }
  , []);
  
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
          {...rows}
          sx={{
            boxShadow:"5px 5px 5px #F0F0F0",
            border: '1px solid #e0e0e0',
            overflowY: 'scroll'
          }}
          rows={rows}
          loading = {rows.length === 0}
          columns={columns}
          
          checkboxSelection
        />
      </Box>
    </main>
  );
}


export default UserList;


