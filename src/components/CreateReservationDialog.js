import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector } from 'react-redux'
import { DesktopDatePicker}  from '@mui/x-date-pickers/DesktopDatePicker';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { postReservation } from '../util/RequestUtil';

function getDefaultValidations() {
    return {
        dateError: {
            error: false,
            message: ""
        },
    }
}

export default function CreateReservationDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());
    const [dateError, setDateError] = React.useState(getDefaultValidations);

    const handleStartChange = (newValue) => {
        setDateError(getDefaultValidations);
        setStartDate(newValue);
    };

    const handleEndChange = (newValue) => {
        setDateError(getDefaultValidations);
        setEndDate(newValue);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const userId = useSelector((state) => state.user.id);
    const token = useSelector((state) => state.user.accessToken);

    const handleReserve = () => {
        const reservationPayload = {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            offer: { id: props.id },
            user: { id: userId }
        }
        
        postReservation(reservationPayload, token).then(res => {
            setOpen(false);
            props.onSaveReservation();
        }).catch(error => {
            let newError = {}
            newError.error = !!error.response.data.violations;
            newError.message = error.response.data.violations[0].message;
            setDateError(newError);
        })
    }

    const addZeroPrefix = (number) => {
        return number < 10 ? `0${number}` : `${number}`;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        let day = addZeroPrefix(date.getDate());
        let month = addZeroPrefix(date.getMonth() + 1);
        return `${date.getFullYear()}-${month}-${day}`
    }

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>
                Reserve
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Reserve</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select time period of the reservation.
                    </DialogContentText>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <DesktopDatePicker
                            label="Start Date"
                            inputFormat="DD/MM/yyyy"
                            value={startDate}
                            onChange={handleStartChange}
                            renderInput={(params) => <TextField {...params} />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <DesktopDatePicker
                                label="End Date"
                                inputFormat="DD/MM/yyyy"
                                value={endDate}
                                onChange={handleEndChange}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Grid>
                        {dateError.error ? <Grid item xs={12}>
                            <Chip sx={{display: "flex"}} label={dateError.message} color="error" variant="outlined" />
                        </Grid> : null}
                    </Grid>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleReserve}>Reserve</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}