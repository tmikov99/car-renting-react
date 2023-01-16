import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Popover from '@mui/material/Popover';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/features/UserSlice';
import { namesToColor, getInitials } from "../util/AvatarUtil";
import { getUserRequest } from "../util/RequestUtil";

const loggedInPages = [
    {name: 'Home', path: '/home'}, 
    {name: 'Offers', path: '/offers/all'}, 
    {name: 'My Offers', path: '/offers/personal'}, 
    {name: 'My Reservations', path: '/myReservations'}
];

const notLoggedInPages = [
  {name: 'Home', path: '/home'}, 
  {name: 'Offers', path: '/offers/all'},
];

const settings = [
    {name: 'Sign In', path: '/signIn'},
    {name: 'Sign Up', path: '/signUp'},
];

const ResponsiveAppBar = () => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userId = useSelector((state) => state.user.id);
  const token = useSelector((state) => state.user.accessToken);

  const pages = isLoggedIn ? loggedInPages : notLoggedInPages;

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [user, setUser] = useState({id: null, firstName: null, lastName: null, email: null});

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function fetchAndUpdateUser() {
    if (!userId) {
      return;
    }
    getUserRequest(userId, token).then(res => {
      setUser(res.data); // update state to force render
    });
  }

  useEffect(() => {
    console.log("Fetch")
    fetchAndUpdateUser();
  }, [userId]);

  const onLogout = () => {
    setAnchorElUser(null);
    dispatch(logout());
  }

  return (
    <><AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <DirectionsCarIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            CRBG
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu} component={Link} to={page.path}>
                  <Typography textAlign="center" href='/testing'>{page.name}</Typography>
                </MenuItem>
              ))}
              {!isLoggedIn && settings.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu} component={Link} to={page.path}>
                  <Typography textAlign="center" href='/testing'>{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <DirectionsCarIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            CRBG
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link} to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {isLoggedIn ? <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: namesToColor(user.firstName, user.lastName) }}>
                  {getInitials(user.firstName, user.lastName)}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Popover
              id="menu-appbar"
              open={Boolean(anchorElUser)}
              anchorEl={anchorElUser}
              onClose={handleCloseUserMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box
                sx={{
                marginTop: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
              >
                  <Avatar sx={{ m: 1, fontSize: 50, bgcolor: namesToColor(user.firstName, user.lastName), width: 100, height: 100 }}>
                      {getInitials(user.firstName, user.lastName)}
                  </Avatar>
                  <Box component="form" noValidate sx={{ m: 3, textAlign: "center" }}>
                      <Typography variant="h5" component="div" textAlign="center">{user.firstName + ' ' + user.lastName}</Typography>
                      <Typography variant="h6" component="div" textAlign="center" noWrap>{user.email}</Typography>
                      <Button
                          sx={{mt: 2}}
                          onClick={onLogout}
                          variant="outlined"
                      >
                          Logout
                      </Button>
                  </Box>
              </Box>
            </Popover>
          </Box> : null}
          {!isLoggedIn ? <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
              <Button
                key="Sign In"
                component={Link} to="/signIn"
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Sign In
              </Button>
              <Button
                key="Sign Up"
                component={Link} to="/signUp"
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Sign Up
              </Button>
          </Box> : null}
        </Toolbar>
      </Container>
    </AppBar>
    <Toolbar /></>
  );
};
export default ResponsiveAppBar;
