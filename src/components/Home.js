import * as React from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { blue, common } from '@mui/material/colors';

export default function Home() {


    return (
        <Container>
          <Box
                sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
          >
            <Avatar sx={{ m: 1, fontSize: 50, bgcolor: blue[700], width: { xs: 250, sm:400, md: 450 }, height: { xs: 250, sm:400, md: 450 } }}>
              <DirectionsCarIcon sx={{width: { xs: 125, sm:200, md: 225 }, height: { xs: 125, sm:200, md: 225 }}} />
            </Avatar>
            <Typography variant="h1" component="div" color={common.white} 
                sx={{ '-webkit-text-stroke-width': 2, '-webkit-text-stroke-color': blue[700], m: 2}}
            >
              Car Renting Bulgaria
            </Typography>
            <Button sx={{ mt: 3, fontWeight: "bold"}} variant="contained" component={Link} to="/offers/all">
                Browse Offers
            </Button>
          </Box>
        </Container>
      );
}