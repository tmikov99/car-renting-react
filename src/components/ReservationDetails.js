import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { namesToColor, getInitials } from "../util/AvatarUtil";
import CreateReservationDialog from "./CreateReservationDialog";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';

import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux'
import { blue, common } from '@mui/material/colors';
import { useNavigate } from "react-router-dom";
import { 
    getReservationById,
    getOfferById, 
    getReservationsByOfferId, 
    getReservationsByOfferIdAndUserId, 
    deleteReservationById, 
    deleteReservationsByOfferId,
    deleteOfferById,
    putReservationIsApprovedById,
    sendMessage,
    getMessagesByReservationId
} from "../util/RequestUtil";

export default function ReservationDetails() {

    let { id } = useParams();
    const userId = useSelector((state) => state.user.id);
    const token = useSelector((state) => state.user.accessToken);
    
    let navigate = useNavigate();

    const [reservation, setReservation] = useState({
        approved: null,
        endDate: null,
        id: null,
        offer: {
            car: {
                automatic: null,
                fuel: null,
                id: null,
                model: null,
                year: null,
            },
            dayCost: null,
            id: null,
            maxDays: null,
            minDays: null,
            town: null,
            user: {
                email: null,
                firstName: null,
                id: null,
                lastName: null,
                phoneNumber: null,
            },
            startDate: null,
            totalCost: null,
        },
        user: {
            email: null,
            firstName: null,
            id: null,
            lastName: null,
            phoneNumber: null,
        }

    });

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const isOwnedReservation = reservation.user.id == userId;

    function trimReservationDates(reservation) {
        let startDate = Date.parse(reservation.startDate);
        let endDate = Date.parse(reservation.endDate);
        reservation.startDate = new Date(startDate).toLocaleDateString("en-GB");
        reservation.endDate = new Date(endDate).toLocaleDateString("en-GB");
    }
    
    function getAndUpdateReservation() {
        getReservationById(id, token).then(res => {
            trimReservationDates(res.data);
            setReservation(res.data);
        });
    }

    function onDeleteReservation(event) {
        const reservationId = id;
        const offerId = reservation.offer.id;
        deleteReservationById(reservationId, token).then(res => {
            navigate("../offer/" + offerId, { replace: true });
        });
    }

    function toggleReservationApproval() {
        let reservationId = id;
        let shouldApprove = !reservation.approved;
        putReservationIsApprovedById(reservationId, shouldApprove, token).then(res => {
            getAndUpdateReservation();
        });
    }

    useEffect(() => {
        getAndUpdateReservation();
        getAndUpdateMessages();
        const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
            getAndUpdateReservation();
            getAndUpdateMessages();
        }, 5000)
  
        return () => clearInterval(intervalId); //This is important
    }, []);

    const handleSubmit = () => {
        let messagePayload = {
            "sender": userId,
            "receiver": isOwnedReservation ? reservation.offer.user.id : reservation.user.id, 
            "message": newMessage,
            "reservationId": id,
        }
        sendMessage(messagePayload).then(res => {
            setNewMessage("");
            getAndUpdateMessages();
        });
    };

    function getAndUpdateMessages() {
        getMessagesByReservationId(id, token).then(res => {
            setMessages(res.data);
        });
    }

    function handleInputChange(event) {
        // console.log(event)
    }

    const user = isOwnedReservation ? reservation.offer.user : reservation.user;
    const offer = reservation.offer;
    return (
        <Container>
            <Typography variant="h3" component="div" sx={{mt: 4, background: blue[700], color: common.white}}>
                Conversation
            </Typography>
            <Grid container spacing={4} sx={{ mt: 2, mb: 2 }}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} key={reservation.id}>
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
                                            <ListItemText primary={user.firstName + ' ' + user.lastName} secondary={isOwnedReservation ? "publisher" : "requester"} />
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
                                                {isOwnedReservation ? <Button variant="outlined" color="error" data-id={reservation.id} onClick={onDeleteReservation}>Delete</Button>
                                                    : <Button variant="outlined" color={reservation.approved ? "error" : "success"} data-id={reservation.id} onClick={toggleReservationApproval}>{reservation.approved ? "Unapprove" : "Approve"}</Button>}
                                            </Stack>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Paper style={{height: 273, overflow: 'auto'}}>
                        <Stack spacing={1} sx={{m: 1}}>
                            {messages.map(message => {
                                let isOwnMessage = message.sender === userId;
                                let messageUser = isOwnMessage ? reservation.user : reservation.offer.user;
                                return (<Box sx={{display: "flex", flexFlow: isOwnMessage ? "row-reverse" : "row"}}>
                                    <Avatar sx={{height: 32, width: 32, fontSize: 14, bgcolor: namesToColor(messageUser.firstName, messageUser.lastName)}}>
                                        {getInitials(messageUser.firstName, messageUser.lastName)}
                                    </Avatar>
                                    <Tooltip title={message.message} arrow>
                                    <Chip label={message.message} sx={{mr: 1, ml: 1, bgcolor: namesToColor(messageUser.firstName, messageUser.lastName), color: "white", maxWidth: "calc(100% - 42px)"}} />
                                    </Tooltip>
                                </Box>)})}
                        </Stack>
                    </Paper>
                    <Box sx={{display: "flex"}}>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="message"
                            name="message"
                            autoFocus
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                  handleSubmit();
                                }
                              }}
                        />
                        <IconButton sx={{width: 80}} onClick={()=>handleSubmit()}>
                            <SendIcon/>
                        </IconButton >
                    </Box>
                </Grid>
            </Grid>
        </Container>
      );
}