import {Box, Button, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography} from '@mui/material'
import axios from 'axios';
import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

function AddUser({t, apiURL}) {
  
  const navigate = useNavigate()

  const [userMail, setuserMail] = React.useState('');
  const [firstName, setfirstName] = React.useState('');
  const [lastName, setlastN] = React.useState('');
  const [newUser, setnewUser] = React.useState('');
  const [userRole, setuserRole] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [companies, setCompanies] = React.useState([]);
  const [selectedCompany, setSelectedCompany] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordMatch, setPasswordMatch] = React.useState(true);

  let getAllCompanies = async () => {
    let res = await axios.get(`${apiURL}/getCompnies?key=${process.env.REACT_APP_TRACT_API_KEY}`);
    setCompanies(res.data);
  }

  const confirmPasswordMatch = () => {
    if(password !== '' && confirmPassword !== '') {
      if(password === confirmPassword) {
        setPasswordMatch(true);
      } else {
        setPasswordMatch(false);
      }
    }
  }

  let ValidateAndSubmit = () => {
    if (userMail === '' || firstName === '' || lastName === '' || newUser === '' && password !== '' && confirmPassword !== '' && passwordMatch) {
      alert(`${t('pleaseEnter')}`);
    } else {
      //generate random password
      setLoading(true);

      fetch(`${apiURL}/createUser?key=${process.env.REACT_APP_TRACT_API_KEY}&email=${userMail}&password=${password}&firstname=${firstName}&lastname=${lastName}&nickname=${newUser}&role=${userRole}&companyid=${selectedCompany}`)
      navigate('/admin/users')
      setLoading(true);

    }
  }

  useEffect(() => {
    getAllCompanies();
  }, []);

  useEffect(() => {
    confirmPasswordMatch()
  }, [password, confirmPassword]);

  return (
    <Box m={2}>
        <Typography variant="h4">{t('addUser')}</Typography>
        <br />
        <Divider />
        <br />
      <br />
      <Typography variant="h6">{t('userInformation')}</Typography>
      <br />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-basic"
            label={t('firstName')}
            variant="outlined"
            style={{width: '100%'}}
            onChange={(e) => setfirstName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-basic"
            label={t('lastName')}
            variant="outlined"
            style={{width: '100%'}}
            onChange={(e) => setlastN(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-basic"
            label={t('email')}
            variant="outlined"
            style={{width: '100%'}}
            onChange={(e) => setuserMail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-basic"
            label={t('username')}
            variant="outlined"
            style={{width: '100%'}}
            onChange={(e) => setnewUser(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{t('role')}</InputLabel>
            <Select
              label={t('role')}
              value={userRole}
              onChange={(e) => setuserRole(e.target.value)}
            >
              <MenuItem value={'0'}>{t('tractAdmin')}</MenuItem>
              <MenuItem value={'1'}>{t('companyAdmin')}</MenuItem>
              <MenuItem value={'2'}>{t('companyWorker')}</MenuItem>
              </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{t('company')}</InputLabel>
            <Select
              label={t('company')}
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
              ))}
              </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField id="outlined-basic" onChange={event => setPassword(event.target.value)} label={t('Password')} type={"password"} variant="outlined" style={{width: '100%'}} value={password} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField id="outlined-basic" onChange={event => setConfirmPassword(event.target.value)} label={t('confirmPassword')} type={"password"} variant="outlined" color={passwordMatch ? 'primary' : 'error'} style={{width: '100%'}} value={confirmPassword} />
          {!passwordMatch && <Typography variant="caption" style={{color: 'red'}}>{t('passwordNotMatch')}</Typography>}
        </Grid>
      </Grid>
      <br />
      <Button variant="outlined" style={{ marginBottom: '1rem', justifyContent: "center" }} color="primary" onClick={() => ValidateAndSubmit()}>
        {t("addUser")}
      </Button>
    </Box>
  )
}

export default AddUser
