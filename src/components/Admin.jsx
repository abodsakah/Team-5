import React from 'react'
import { styled, Typography, Table, TableRow, TableBody, TableCell, TableContainer, TableHead, Paper } from '@mui/material';


const Admin = ({cookies}) => {

  const CenteredContainer = styled('div')`
    display: flex;
    justify-content: center;
    align-items: center;
  `

  const rows = [
    {name: 'Dörrsensorer', datum: '23 feb 2022', ID: '218-9', Antal: '13'},
    {name: 'Hisssensorer', datum: '13 aug 2022', ID: '216-2', Antal: '9'},
    {name: 'Temperaturesensorer', datum: '5 mars 2022', ID: '221-6', Antal: '2'},
  ];
  

  return (
    <>
      <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.datum}</TableCell>
                <TableCell>{row.ID}</TableCell>
                <TableCell>{row.Antal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Admin