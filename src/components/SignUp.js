import * as React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from "react-router-dom";
import { registerUser } from '../util/RequestUtil';
import { useState } from 'react';


function getDefaultValidations() {
  return {
    email: {
      error: false,
      message: ""
    },
    phoneNumber: {
      error: false,
      message: ""
    },
    firstName: {
      error: false,
      message: ""
    },
    lastName: {
      error: false,
      message: ""
    },
    password: {
      error: false,
      message: ""
    },
    matchingPassword: {
      error: false,
      message: ""
    }
  }
}

export default function SignUp() {
    const [validations, setValidations] = useState(getDefaultValidations());

    let navigate = useNavigate();
    const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      let user = {
        "firstName": data.get('firstName'),
        "lastName": data.get('lastName'),
        "email": data.get('email'),
        "password": data.get('password'),
        "matchingPassword": data.get('matchingPassword'),
        "phoneNumber": data.get('phoneNumber'),
      }
      registerUser(user).then(res => {
        setValidations(getDefaultValidations());
        navigate("../signIn", { replace: true });
      }).catch(error => {
        handleValidations(error.response.data);
      })
    };

    const handleValidations = (validationResponse) => {
      let validations = getDefaultValidations();
      validationResponse.violations.forEach(violaion => {
        validations[violaion.fieldName].error = true;
        validations[violaion.fieldName].message = violaion.message;
      });
      setValidations(validations);
    }
  
    return (
        <Box
          sx={{
            marginTop: 8,
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '50rem'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, ml: 3, mr: 3, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  error={validations.email.error}
                  helperText={validations.email.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  id="phoneNumber"
                  autoComplete="phone-number"
                  error={validations.phoneNumber.error}
                  helperText={validations.phoneNumber.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="first-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  error={validations.firstName.error}
                  helperText={validations.firstName.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="last-name"
                  name="lastName"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  error={validations.lastName.error}
                  helperText={validations.lastName.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  error={validations.password.error}
                  helperText={validations.password.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="matchingPassword"
                  label="Repeat Password"
                  type="password"
                  id="matchingPassword"
                  error={validations.password.error}
                  helperText={validations.password.message}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
    );
  }