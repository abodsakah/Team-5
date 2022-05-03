import React from 'react'
import {styled, Typography, Button, Box, Grid, Card, CardMedia, CardContent} from '@mui/material';
import {Link} from 'react-router-dom'
import LoadingOverlay from '../LoadingOverlay';

const Companies = ({cookies, t, apiURL, color}) => {

    const [isLoading, setIsLoading] = React.useState(true)
    const [companies, setCompanies] = React.useState([])
    const Actions = styled('div')`
      display: flex;
      justify-content: end;
      align-items: center;
    `

  fetch(`${apiURL}getCompnies?key=${process.env.REACT_APP_TRACT_API_KEY}`).then(res => res.json()).then(res => {
    if (isLoading) {
      setCompanies(res)
      setIsLoading(false)
    }
  })

    return (
      <>
        <Box m={2}>
          <Typography variant="h4">{t('tractAdminPanel')}</Typography>
          <br />
          <Typography variant="h6">{t('companies')}</Typography>
          <Actions>
            <Button style={{
              float: 'left',
              marginBottom: '1rem',
              marginTop: '1rem',
              color: color,
              borderColor: color
            }}
              variant="outlined"
              component={Link}
              to="/admin/add-company">
              {t('addCompany')}</Button>
          </Actions>
          <LoadingOverlay loading={isLoading} />
          <Grid container spacing={10}>
            {companies.map(company => (
              <Grid item xs={12} md={4} key={company.id}>
                <Card component={Link} to={`/admin/edit-company/${company.id}`}>
                  <div
                    style={{
                      backgroundColor: `#${company.color}`,
                      height: '140px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img src={`${apiURL}static/uploads/logo/${company.logo}`} width={'50%'}/>
                  </div>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {company.name}
                    </Typography>
                  </CardContent>
                </Card>

              </Grid>
            ))} 
          </Grid>
        </Box>
      </>
    )
}

export default Companies