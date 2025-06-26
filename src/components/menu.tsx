import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MenuBar: React.FC = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{ flexGrow: 1, display: { xs: 'flex' } }}>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h6" color="inherit" component="div">
                                Urbárik
                            </Typography>
                            <Button color="inherit" startIcon={<HomeIcon />} onClick={() => navigate('/')}>
                                Home
                            </Button>
                            <Button color="inherit" startIcon={<SettingsIcon />} onClick={() => navigate('/settings')}>
                                Settings
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
}

export default MenuBar;