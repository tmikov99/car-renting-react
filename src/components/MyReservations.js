import * as React from 'react';
import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { namesToColor, getInitials } from "../util/AvatarUtil";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { blue, common } from '@mui/material/colors';
import { getReservationsByUserId, deleteReservationById } from '../util/RequestUtil';

function createData(id, offer, user, startDate, endDate, totalCost, approved) {
    return { id, offer, user, startDate, endDate, totalCost, approved };
}

export default function MyReservations() {
    const [rows, setStateValues] = useState([]);
    const id = useSelector((state) => state.user.id);
    const token = useSelector((state) => state.user.accessToken);

    function updateReservations() {
        getReservationsByUserId(id, token).then(res => {
        let newRows = [];
        res.data.forEach(reservation => {
            trimReservationDates(reservation);
            newRows.push(createData(
                reservation.id, 
                reservation.offer, 
                reservation.user, 
                reservation.startDate, 
                reservation.endDate, 
                reservation.totalCost, 
                reservation.approved));
        });
        setStateValues(newRows);
      });
    }

    function trimReservationDates(reservation) {
        let startDate = Date.parse(reservation.startDate);
        let endDate = Date.parse(reservation.endDate);
        reservation.startDate = new Date(startDate).toLocaleDateString("en-GB");
        reservation.endDate = new Date(endDate).toLocaleDateString("en-GB");
    }

    function onDeleteReservation(event) {
        const reservationId = event.currentTarget.getAttribute("data-id");
        deleteReservationById(reservationId, token).then(res => {
            updateReservations();
        });
    }

    useEffect(() => {
      updateReservations();
      const intervalId = setInterval(() => {
        updateReservations();
      }, 5000)

      return () => clearInterval(intervalId);
    }, []);
    return (
        <Container>
          <Typography variant="h3" component="div" sx={{mt: 4, background: blue[700], color: common.white}}>
              My Reservations
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2, mb: 4 }}>
          {rows.length === 0 ?
            <Grid item xs={12}>
            <Alert variant="outlined" severity="info">
                You currently have no reservations
            </Alert>
           </Grid> : null}
          {rows.map((reservation) =>  {
            const user = reservation.offer.user;
            const offer = reservation.offer;
            return (<Grid item xs={12} sm={12} md={6} lg={6} xl={6} key={reservation.id}>
                <Card>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={12} sm={7}>
                                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                    <ListItem key="name">
                                        <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: namesToColor(user.firstName, user.lastName) }}>
                                            {getInitials(user.firstName, user.lastName)}
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={user.firstName + ' ' + user.lastName} secondary="publisher" />
                                    </ListItem>
                                    <ListItem key="model">
                                        <ListItemAvatar>
                                        <Avatar>
                                            <DirectionsCarIcon />
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={offer.car.model} secondary="car model" />
                                    </ListItem>
                                    <ListItem key="town">
                                        <ListItemAvatar>
                                        <Avatar>
                                            <LocationCityIcon />
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={offer.town} secondary="town" />
                                    </ListItem>
                                    <ListItem key="cost">
                                        <ListItemAvatar>
                                        <Avatar>
                                            <AttachMoneyIcon />
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={reservation.totalCost + " lv"} secondary="total cost" />
                                    </ListItem>
                                </List>
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <Divider sx={{ display: { xs: 'flex', sm: 'none' }}} orientation="horizontal" variant="middle" />
                                <Box sx={{display: "flex", flexDirection: "row", height: "100%"}}>
                                    <Divider sx={{ display: { xs: 'none', sm: 'flex' }}} orientation="vertical" variant="middle" />
                                    <Box>
                                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                            <ListItem key="start">
                                                <ListItemAvatar>
                                                <Avatar>
                                                    <CalendarMonthIcon />
                                                </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={reservation.startDate} secondary="start date" />
                                            </ListItem>
                                            <ListItem key="end">
                                                <ListItemAvatar>
                                                <Avatar>
                                                    <EventRepeatIcon />
                                                </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={reservation.endDate} secondary="end date" />
                                            </ListItem>
                                        </List>
                                        <Stack spacing={2} alignSelf="center" sx={{ml: 2}}>
                                            {reservation.approved ? <Chip label="Aprooved" color="success" />
                                                : <Chip label="Pending approval" color="warning" />}
                                            <Button variant="contained" component={Link} to={`/offer/${offer.id}`}>To offer</Button>
                                            <Button variant="outlined" color="error" data-id={reservation.id} onClick={onDeleteReservation}>Delete</Button>
                                        </Stack>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
          )})}
          </Grid>
        </Container>
    );
}
