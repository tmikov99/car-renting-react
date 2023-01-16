import * as React from 'react';
import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Link, useParams } from 'react-router-dom';
import { blue, common } from '@mui/material/colors';
import { useSelector } from 'react-redux'
import CreateOfferDialog from './CreateOfferDialog';
import { getOffers, getOffersByUserId } from "../util/RequestUtil";
import { CardActionArea } from '@mui/material';
import Alert from '@mui/material/Alert';


function createData(id, town, minDays, maxDays, car, user, cost, image) {
  return { id, town, minDays, maxDays, car, user, cost, image };
}

export default function Offers() {
    const [rows, setStateValues] = useState([]);
    const id = useSelector((state) => state.user.id);
    const token = useSelector((state) => state.user.accessToken);
    const [searchModel, setSearchModel] = useState("");
    const [searchTown, setSearchTown] = useState("");

    let { scope } = useParams();
    let isPersonalView = scope === "personal";
    
    function UpdateOffers() {
      let offerFunction = isPersonalView ? getOffersByUserId(id, token) : getOffers();
      
      offerFunction.then(res => {
        let newRows = [];
        res.data.forEach(offer => {
          let image = offer.imageUrls ? offer.imageUrls[0] : "";
            newRows.push(createData(offer.id, offer.town, offer.minDays, offer.maxDays, offer.car, offer.user, offer.dayCost, image));
        });
        setStateValues(newRows);
      });
    }

    function filterRows(rows) {
      let searchModelToLower = searchModel.toLowerCase();
      let searchTownToLower = searchTown.toLowerCase();
      return rows.filter(row => {
        const carModel = row.car.model.toLowerCase();
        const offerTown = row.town.toLowerCase();
        return carModel.includes(searchModelToLower) && offerTown.includes(searchTownToLower);
      });
    }

    useEffect(() => {
      UpdateOffers();
      const intervalId = setInterval(() => {  
        UpdateOffers();
      }, 5000)

      return () => clearInterval(intervalId); 
    }, [isPersonalView]);

    return (
      <Container>
        <Typography variant="h3" component="div" sx={{mt: 4, background: blue[700], color: common.white}}>
            {isPersonalView ? 'My Offers' : 'Offers'}
        </Typography>
        {isPersonalView ? <CreateOfferDialog onSaveOffer={UpdateOffers}/> : null}
        <Grid container spacing={4} sx={{ mt: 0, mb: 4 }}>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField
              margin="normal"
              fullWidth
              id="searchModel"
              name="searchModel"
              value={searchModel}
              onChange={(e) => setSearchModel(e.target.value)}
              label="Model"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <TextField
              margin="normal"
              fullWidth
              id="searchTown"
              name="searchTown"
              value={searchTown}
              onChange={(e) => setSearchTown(e.target.value)}
              label="Town"
            />
          </Grid>
          {filterRows(rows).length === 0 ?
            <Grid item xs={12}>
            <Alert variant="outlined" severity="info">
                No Offers to show
            </Alert>
           </Grid> : null}
          {filterRows(rows).map((row) => {
            const offerLink = `/offer/${row.id}`;
            return (
              <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={row.id}>
                <Card>
                  <CardActionArea component={Link} to={offerLink}>
                    <CardMedia
                      sx={{ height: { xs: 300, sm:150, md: 300, lg: 200, xl: 150 } }}
                      component="img"
                      image={row.image}
                      alt="Error loading image"
                    />
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {row.town}
                      </Typography>
                      <Typography variant="h4" component="div" noWrap>
                        {row.car.model}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {row.minDays} - {row.maxDays} days
                      </Typography>
                      <Typography variant="body1">
                        {row.cost} lv/day
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                
              </Grid>
            )
          })}
        </Grid>
      </Container>
    );
}
