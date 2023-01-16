import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import { useState } from 'react';
import { postOffer } from '../util/RequestUtil';

const carDefaultValues = {
    model: "",
    year: "",
    fuel: "",
    automatic: "automatic",
  };

const offerDefaultValues = {
    town: "",
    dayCost: "",
    minDays: "",
    maxDays: "",
};

const imagesDefaultValue = {
    length: 0,
}

function getDefaultValidations() {
    return {
        town: {
            error: false,
            message: ""
        },
        dayCost: {
            error: false,
            message: ""
        },
        minDays: {
            error: false,
            message: ""
        },
        maxDays: {
            error: false,
            message: ""
        },
        model: {
            error: false,
            message: ""
        },
        year: {
            error: false,
            message: ""
        },
        fuel: {
            error: false,
            message: ""
        },
        automatic: {
            error: false,
            message: ""
        }
    }
}

export default function CreateOfferDialog(props) {
    
    const [open, setOpen] = React.useState(false);
    const [carFormValues, setCarFormValues] = useState(carDefaultValues);
    const [offerFormValues, setOfferFormValues] = useState(offerDefaultValues);
    const [validations, setValidations] = useState(getDefaultValidations());
    const [images, setImages] = useState(imagesDefaultValue);
    const [imageUrls, setImageUrls] = useState([]);
    const [fileSizeExceeded, setFileSizeExceeded] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCarFormValues(carDefaultValues);
        setOfferFormValues(offerDefaultValues);
        setImages(imagesDefaultValue);
        setImageUrls([]);
        setFileSizeExceeded(false);
    };

    const userId = useSelector((state) => state.user.id);
    const token = useSelector((state) => state.user.accessToken);

    const getCarGearType = (gearString) => {
        if (gearString === "automatic") {
            return true;
        }
        if (gearString === "manual") {
            return false;
        }
        return null;
    } 

    const handleSave = (event) => {
        event.preventDefault();

        const offerPayload = {
            town: offerFormValues.town,
            dayCost: parseInt(offerFormValues.dayCost),
            minDays: parseInt(offerFormValues.minDays),
            maxDays: parseInt(offerFormValues.maxDays),
            car: {
                model: carFormValues.model,
                fuel: carFormValues.fuel,
                automatic: getCarGearType(carFormValues.automatic),
                year: parseInt(carFormValues.year),
            },
            user: {
                id: userId
            }
        }

        postOffer(offerPayload, images, token).then(res => {
            // setOpen(false);
            props.onSaveOffer();
            // setCarFormValues(carDefaultValues);
            // setOfferFormValues(offerDefaultValues);
            handleClose();
        }).catch(error => {
            handleValidations(error.response.data);
        });
    }

    const handleValidations = (validationResponse) => {
        let validations = getDefaultValidations();
        validationResponse.violations.forEach(violaion => {
            let fieldName = violaion.fieldName.split('.').pop()
            validations[fieldName].error = true;
            validations[fieldName].message = violaion.message;
        });
        setValidations(validations);
    }

    const handleCarInputChange = (e) => {
        const { name, value } = e.target;
        setCarFormValues({
          ...carFormValues,
          [name]: value,
        });
      };

    const handleOfferInputChange = (e) => {
        const { name, value } = e.target;
        setOfferFormValues({
            ...offerFormValues,
            [name]: value,
        });
    };

    const handleUploadClick = (e) => {
        const MAX_BYTES = 1000000;
        let files = e.target.files;
        let urlList = [];
        setFileSizeExceeded(false);
        for (let i = 0; i < files.length; i++) {
            if (files[i].size >= MAX_BYTES) {
                setFileSizeExceeded(true);
            }
            const reader = new FileReader();
            reader.onloadend = function(e) {
                console.log([reader.result]);
                urlList.push(reader.result);
            }.bind(this);
            reader.readAsDataURL(files[i]);
        };
        console.log(e.target.files)
        
        setImages(e.target.files);
        setImageUrls(urlList);
    };

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen} sx={{mt: 4}}>
                Create Offer
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create Offer</DialogTitle>
                <Divider orientation="horizontal" variant="middle" />
                <DialogContent>
                    <Box>
                        <Typography component="div" variant="h6">
                            Car specifications
                        </Typography>
                        <Grid container spacing={2} sx={{mt: 1}}>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    id="model-input"
                                    name="model"
                                    label="Model"
                                    type="text"
                                    value={carFormValues.model}
                                    onChange={handleCarInputChange}
                                    error={validations.model.error}
                                    helperText={validations.model.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField 
                                    fullWidth
                                    id="year-input"
                                    name="year"
                                    label="Year"
                                    type="number"
                                    value={carFormValues.year}
                                    onChange={handleCarInputChange}
                                    error={validations.year.error}
                                    helperText={validations.year.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={validations.fuel.error}>
                                    <InputLabel id="fuel-simple-select-label">Fuel type</InputLabel>
                                    <Select
                                    labelId="fuel-simple-select-label"
                                    id="fuel-simple-select"
                                    name="fuel"
                                    value={carFormValues.fuel}
                                    label="Fuel type"
                                    onChange={handleCarInputChange}
                                    >
                                        <MenuItem key="PETROL" value="PETROL">Petrol</MenuItem>
                                        <MenuItem key="DIESEL" value="DIESEL">Diesel</MenuItem>
                                        <MenuItem key="LPG" value="LPG">LPG</MenuItem>
                                        <MenuItem key="HYBRID" value="HYBRID">Hybrid</MenuItem>
                                        <MenuItem key="ELECTRIC" value="ELECTRIC">Electric</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={validations.automatic.error}>
                                <InputLabel id="gearbox-simple-select-label">Gearbox</InputLabel>
                                    <Select
                                    labelId="gearbox-simple-select-label"
                                    id="gearbox-simple-select"
                                    name="automatic"
                                    value={carFormValues.automatic}
                                    label="Gearbox"
                                    onChange={handleCarInputChange}                                    
                                    >
                                        <MenuItem key="automatic" value="automatic">Automatic</MenuItem>
                                        <MenuItem key="manual" value="manual">Manual</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>                            
                        </Grid>
                        <Typography component="div" variant="h6" sx={{mt: 2}}>
                            Offer specifications
                        </Typography>
                        <Grid container spacing={2} sx={{mt: 1}}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="town-input"
                                    name="town"
                                    label="Town"
                                    type="text"
                                    value={offerFormValues.town}
                                    onChange={handleOfferInputChange}
                                    error={validations.town.error}
                                    helperText={validations.town.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="day-cost-input"
                                    name="dayCost"
                                    label="Daily cost"
                                    type="number"
                                    value={offerFormValues.model}
                                    onChange={handleOfferInputChange}
                                    error={validations.dayCost.error}
                                    helperText={validations.dayCost.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="min-days-input"
                                    name="minDays"
                                    label="Min days"
                                    type="number"
                                    value={offerFormValues.model}
                                    onChange={handleOfferInputChange}
                                    error={validations.minDays.error}
                                    helperText={validations.minDays.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="max-days-input"
                                    name="maxDays"
                                    label="Max days"
                                    type="number"
                                    value={offerFormValues.model}
                                    onChange={handleOfferInputChange}
                                    error={validations.maxDays.error}
                                    helperText={validations.maxDays.message}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{mt: 1}}>
                            {fileSizeExceeded ?
                                <Grid item xs={12}>
                                    <Alert severity="error">An image file exceeds the maximum size! Cannot create offer.</Alert> 
                                </Grid>: null
                            }
                            <Grid item xs={12}>
                                {images.length > 0 ? imageUrls.map(url => 
                                    <img
                                        width="100%"
                                        src={url}
                                    />) : null
                                }  
                                <input
                                    style={{display:"none"}}
                                    accept="image/*"
                                    id="contained-button-file"
                                    multiple
                                    type="file"
                                    onChange={handleUploadClick}
                                />
                                <label htmlFor="contained-button-file">
                                    <Button
                                        component="span"
                                        fullWidth
                                        variant="contained"
                                    >
                                        Upload photos
                                    </Button>
                                </label>       
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{mt: 1}}>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleSave}
                                >
                                    Save
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}