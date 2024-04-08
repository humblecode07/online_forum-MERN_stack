import React, { useState } from 'react'
import { Box, Button, Grid, Stack, Typography, Avatar } from '@mui/material'
import { styled } from '@mui/system';
import ForumIcon from '@mui/icons-material/Forum';
import FilterFramesIcon from '@mui/icons-material/FilterFrames';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import firefly from '../pages/image/firefly.png'
import { NavLink, useNavigate } from 'react-router-dom';

const SidebarButton = ({ to, text, ...rest }) => {
    return (
        <Button component={NavLink} to={to} {...rest}>
            {text}
        </Button>
    );
};

const SideNav = () => {
    const [selected, setSelected] = useState();
    const navigate = useNavigate();

    return (
        <Box
            display={'flex'}
            flex={1}
            bgcolor={"#f2f2f2"}
            flexDirection={"column"}
        >
            <Stack direction="column" spacing={1} alignItems="center" sx={{
                marginBottom: '30px'
            }}>
                <Stack spacing={9} direction={'row'} justifyContent={'space-around'} alignItems={'center'} sx={{
                    paddingTop: '15px'
                }}>
                    <Typography variant="h5" sx={{
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        fontFamily: 'Roboto',
                        fontSize: '20px',
                        fontWeight: 300,
                    }}>DYCI HUB</ Typography>
                    <IconButton aria-label="minimize side-nav"><MenuIcon /></IconButton>
                </Stack>
                <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}>
                    <img src={firefly} alt="Firefly" style={{ borderRadius: '50%' }} />
                </Avatar>
                <Typography variant="h3" sx={{
                    paddingTop: '12px',
                    fontFamily: 'Roboto',
                    fontSize: '25px',
                    fontWeight: 1000,
                }}>Firefly</Typography>
                <Typography variant="body1">
                    Admin
                </Typography>
            </Stack>
            <Grid direction={'column'} container spacing={1} sx={{
                paddingLeft: '32px',
            }}>
                <Grid item sx={{ width: '200px' }}>
                    <SidebarButton startIcon={<DashboardIcon />} to="/admin/dashboard" text="Dashboard" sx={{ width: '100%', justifyContent: 'flex-start' }} />
                </Grid>
                <Typography variant="h6" sx={{ fontFamily: 'Roboto', fontSize: '14px', color: 'rgba(0, 0, 0, 0.87)', marginTop: '15px' }}>
                    Application
                </Typography>
                <Grid item sx={{ width: '200px' }}>
                    <SidebarButton
                        to="/admin/forums"
                        text="Discussion Forums"
                        color="secondary"
                        startIcon={<ForumIcon />}
                        sx={{ width: '100%', justifyContent: 'flex-start' }}
                    />
                </Grid>
                <Grid item sx={{ width: '200px' }}>
                    <SidebarButton startIcon={<FilterFramesIcon />} to="/admin/users" text="Bulletin Board" sx={{ width: '100%', justifyContent: 'flex-start' }} />
                </Grid>
                <Grid item sx={{ width: '200px' }}>
                    <SidebarButton startIcon={<AssessmentIcon />} to="/admin/users" text="Reports" sx={{ width: '100%', justifyContent: 'flex-start' }} />
                </Grid>
                <Grid item sx={{ width: '200px' }}>
                    <SidebarButton startIcon={<PeopleAltIcon />} to="/admin/users" text="Users" sx={{ width: '100%', justifyContent: 'flex-start' }} />
                </Grid>
            </Grid>


        </Box>
    )
}

export default SideNav
