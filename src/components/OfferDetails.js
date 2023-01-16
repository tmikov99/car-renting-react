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
import { CardActionArea } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux'
import { blue, common } from '@mui/material/colors';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { useNavigate } from "react-router-dom";
import { 
    getOfferById, 
    getReservationsByOfferId, 
    getReservationsByOfferIdAndUserId, 
    deleteReservationById, 
    deleteReservationsByOfferId,
    deleteOfferById,
    putReservationIsApprovedById
} from "../util/RequestUtil";

const fuelKeyToText = {
    "DIESEL": "Diesel",
    "PETROL": "Petrol",
    "LPG": "LPG",
    "HYBRID": "Hybrid",
    "ELECTRIC": "Electric",
}

export default function OfferDetails() {
    let { id } = useParams();
    const userId = useSelector((state) => state.user.id);
    const token = useSelector((state) => state.user.accessToken);
    
    let navigate = useNavigate();

    const [offer, setOffer] = useState({
        id: id,
        town: null,
        minDays: null,
        maxDays: null,
        dayCost: null,
        car: {
            id: null,
            model: null,
            fuel: null,
            year: null,
            automatic: null,
        },
        user: {
            id: null,
            firstName: null,
            lastName: null,
            email: null
        },
        imageUrls: [],
    });

    const isOwnedOffer = offer.user.id == userId;

    const [reservations, setReservations] = useState([]);

    function trimReservationDates(reservation) {
        let startDate = Date.parse(reservation.startDate);
        let endDate = Date.parse(reservation.endDate);
        reservation.startDate = new Date(startDate).toLocaleDateString("en-GB");
        reservation.endDate = new Date(endDate).toLocaleDateString("en-GB");
    }

    const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
    const [imageToZoom, setImageToZoom] = React.useState("");

    const handleClickImageOpen = (event) => {
        setImageDialogOpen(true);
        setImageToZoom(event.currentTarget.getAttribute("data-id"));
    };

    const handleImageClose = (event) => {
        setImageDialogOpen(false);
        setImageToZoom("");
    };
    
    function getAndUpdateOffer() {
        getOfferById(id).then(res => {
            setOffer(res.data);
        });
    }

    function getAndUpdateReservations() {
        const reservationRequest = isOwnedOffer ? getReservationsByOfferId(id, token) : getReservationsByOfferIdAndUserId(id, userId, token);
        reservationRequest.then(res => {
            res.data.forEach(reservation => {
                trimReservationDates(reservation);
            });
            setReservations(res.data);
        });
    }

    function onDeleteReservation(event) {
        event.stopPropagation();
        const reservationId = event.currentTarget.getAttribute("data-id");
        deleteReservationById(reservationId, token).then(res => {
            getAndUpdateReservations();
        });
    }

    function onApproveReservation(event) {
        event.stopPropagation();
        const reservationId = event.currentTarget.getAttribute("data-id");
        toggleReservationApproval(reservationId, true);
    }

    function onUnapproveReservation(event) {
        event.stopPropagation();
        const reservationId = event.currentTarget.getAttribute("data-id");
        toggleReservationApproval(reservationId, false);
    }

    function toggleReservationApproval(reservationId, shouldApprove) {
        putReservationIsApprovedById(reservationId, shouldApprove, token).then(res => {
            getAndUpdateReservations();
        });
    }

    function deleteOffer() {
        deleteReservationsByOfferId(id, token).then(res => {
            deleteOfferById(id, token).then(res => {
                navigate("../offers/personal", { replace: true });
            });
        });
    }

    function goToReservationConversation(event) {
        const reservationId = event.currentTarget.getAttribute("data-id");
        navigate("../reservation/" + reservationId, { replace: true });
    }

    useEffect(() => {
        getAndUpdateOffer();
        getAndUpdateReservations();
    }, [offer.user.id]);

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      }));

    var items = [
        {
            name: "Random Name #1",
            description: "Probably the most random thing you have ever seen!"
        },
        {
            name: "Random Name #2",
            description: "Hello World!"
        }
    ]

    function srcset(image, width, height, rows = 1, cols = 1) {
        return {
          src: `${image}&w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
          srcSet: `${image}?w=${width * cols}&h=${
            height * rows
          }&fit=crop&auto=format&dpr=2 2x`,
        };
      }

    return (
      <Container>
        <Typography variant="h3" component="div" sx={{mt: 4, background: blue[700], color: common.white}}>
            {offer.car.model}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
                {!isOwnedOffer ? 
                    <CreateReservationDialog id={offer.id} onSaveReservation={getAndUpdateReservations}/>
                    : 
                    <Button variant="outlined" color="error" onClick={deleteOffer}>
                        Delete
                    </Button>
                }
            </Grid> 
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Card sx={{ }}>
                    <CardContent>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            <ListItem>
                                <ListItemAvatar>
                                <Avatar>
                                    <LocationCityIcon />
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={offer.town} secondary="town" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                <Avatar>
                                    <AccessTimeIcon />
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={offer.minDays + (offer.minDays > 1 ? " days" : " day")} secondary="minimum period" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                <Avatar>
                                    <AccessTimeIcon />
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={offer.maxDays + (offer.maxDays > 1 ? " days" : " day")} secondary="maximum period" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                <Avatar>
                                    <AttachMoneyIcon />
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={offer.dayCost + " lv/day"} secondary="daily cost" />
                            </ListItem>
                        </List>
                    </CardContent>
                    <CardActions>
                    </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Card sx={{ }}>
                    <CardContent>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            <ListItem>
                                <ListItemAvatar>
                                <Avatar>
                                    <DirectionsCarIcon />
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={offer.car.model} secondary="model" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                <Avatar>
                                    <CalendarMonthIcon />
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={offer.car.year} secondary="year" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                <Avatar>
                                    <LocalGasStationIcon />
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={fuelKeyToText[offer.car.fuel]} secondary="fuel type" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                <Avatar>
                                    G
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={offer.car.automatic ? "Automatic" : "Manual"} secondary="gearbox" />
                            </ListItem>
                        </List>
                    </CardContent>
                    <CardActions>
                    </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Card sx={{ }}>
                    <CardContent>
                    <Box
                        sx={{
                        marginTop: 4,
                        marginBottom: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{mb: 4, fontSize: 50, bgcolor: namesToColor(offer.user.firstName, offer.user.lastName), width: 100, height: 100}}>
                            {getInitials(offer.user.firstName, offer.user.lastName)}
                        </Avatar>
                        <Typography variant="h4" component="div">
                            {offer.user.firstName}
                        </Typography>
                        <Typography variant="h4" component="div">
                            {offer.user.lastName}
                        </Typography>
                        <Typography variant="h6" component="div">
                            Contact: {offer.user.phoneNumber}
                        </Typography>
                        </Box>
                    </CardContent>
                    <CardActions>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
        {reservations.length > 0 ? <Box sx={{mt: 4}}>
            <Typography variant="h4" component="div">
                {isOwnedOffer ? 'Reservations' : 'My Reservations'}
            </Typography>
            <Stack spacing={2} sx={{mt: 2, mb: 4}}>
                {reservations.map(reservation => (
                    <Item sx={{display: "flex"}} key={reservation.id} data-id={reservation.id} onClick={goToReservationConversation}>
                        <Grid container spacing={3}>
                            {isOwnedOffer ? <><Grid item xs={12} sm={6} md={3}>
                                <Box>
                                    <Typography variant="body1" component="div">
                                        First name
                                    </Typography>
                                    <Typography variant="h6" component="div" color={common.black}>
                                        {reservation.user.firstName}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box>
                                    <Typography variant="body1" component="div">
                                        Last name
                                    </Typography>
                                    <Typography variant="h6" component="div" color={common.black}>
                                        {reservation.user.lastName}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box>
                                    <Typography variant="body1" component="div">
                                        Email
                                    </Typography>
                                    <Typography variant="h6" component="div" color={common.black}>
                                        {reservation.user.email}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center"}}>
                                    {reservation.approved ?
                                        <Button variant="outlined" color="error" data-id={reservation.id} onClick={onUnapproveReservation}>
                                            Unapprove
                                        </Button>
                                        :
                                        <Button variant="contained" color="success" data-id={reservation.id} onClick={onApproveReservation}>
                                            Approve
                                        </Button>
                                    }
                                </Box>
                            </Grid></> : null}


                            
                            <Grid item xs={12} sm={6} md={3}>
                                <Box>
                                    <Typography variant="body1" component="div">
                                        Start date
                                    </Typography>
                                    <Typography variant="h6" component="div" color={common.black}>
                                        {reservation.startDate}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box>
                                    <Typography variant="body1" component="div">
                                        End date
                                    </Typography>
                                    <Typography variant="h6" component="div" color={common.black}>
                                        {reservation.endDate}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box>
                                    <Typography variant="body1" component="div">
                                        Total cost
                                    </Typography>
                                    <Typography variant="h6" component="div" color={common.black}>
                                        {reservation.totalCost} lv
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box>
                                    <Typography variant="body1" component="div">
                                        Approved
                                    </Typography>
                                    <Typography  variant="h6" component="div" color={common.black}>
                                        {reservation.approved ? 'YES' : 'PENDING'}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        {!isOwnedOffer ? <Tooltip title="Delete reservation">
                            <IconButton aria-label="delete" size="large" sx={{width: 56, height: 56}} data-id={reservation.id} onClick={onDeleteReservation}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip> : null}
                    </Item>
                ))}
            </Stack>
        </Box> : null}
        <Box sx={{mt: 4}}>
        <Grid container spacing={4} sx={{ mt: 0, mb: 4 }}>
        {offer.imageUrls.map((imageUrl) => {
            return (
              <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={imageUrl}>
                <Card>
                  <CardActionArea data-id={imageUrl} onClick={handleClickImageOpen}>
                    <CardMedia
                      sx={{ height: { xs: 300, sm:150, md: 300, lg: 200, xl: 150 } }}
                      component="img"
                      image={imageUrl}
                      alt="Error loading image"
                    />
                  </CardActionArea>
                </Card>
                
              </Grid>
            )
        })}
        </Grid>
        <Dialog open={imageDialogOpen} onClose={handleImageClose} maxWidth="xl">
                {/* <DialogTitle>Reserve</DialogTitle> */}
                <DialogContent>
                    <img src={imageToZoom} />
                </DialogContent>
            </Dialog>
        </Box>
      </Container>
    );
  }