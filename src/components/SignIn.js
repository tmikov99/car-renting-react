import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logon } from '../redux/features/UserSlice';
import { logInUser } from '../util/RequestUtil';
import { useState } from 'react';

function getDefaultValidations() {
    return {
      email: {
        error: false,
        message: ""
      },
      password: {
        error: false,
        message: ""
      },
    }
  }

export default function SignIn() {
    const [validations, setValidations] = useState(getDefaultValidations());

    const dispatch = useDispatch();
    
    const location = useLocation();

    let navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let user = {
            "email": data.get('email'),
            "password": data.get('password'),
        }
        logInUser(user).then(res => {
            setValidations(getDefaultValidations());
            console.log(res.data)
            dispatch(logon(res.data));
            if(location.pathname === "/signIn") {
                navigate("../home", { replace: true });
            }
        }).catch(error => {
            handleValidations(error.response.data);
        });
    };

    const handleValidations = (validationResponse) => {
        let validations = getDefaultValidations();
        if (validationResponse.violations) {
            validationResponse.violations.forEach(violaion => {
                validations[violaion.fieldName].error = true;
                validations[violaion.fieldName].message = violaion.message;
              });
        }
        if (validationResponse.status && validationResponse.status === "UNAUTHORIZED") {
            validations = {
                email: {
                    error: true,
                    message: "Incorrect Email or Password"
                },
                password: {
                    error: true,
                    message: "Incorrect Email or Password"
                },
            }
        }
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
            maxWidth: '28rem'
        }}
    >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
            Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, ml: 3, mr: 3, mb: 3 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={validations.email.error}
                helperText={validations.email.message}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                error={validations.password.error}
                helperText={validations.password.message}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Sign In
            </Button>
            <Link href="/signUp" variant="body2">
                {"Don't have an account? Sign Up"}
            </Link>
        </Box>
    </Box>
  );
}