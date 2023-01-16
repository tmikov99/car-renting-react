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


export default function ImageViewDialog(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>
                Reserve
            </Button>
            <Dialog open={props.open} onClose={handleClose}>
                <DialogTitle>Reserve</DialogTitle>
                <DialogContent>
                    
                </DialogContent>
            </Dialog>
        </div>
    );
}