import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import CottageIcon from '@mui/icons-material/Cottage';
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
                            <Button
                                color="inherit"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    position: 'relative',
                                    '& .default-icon': {
                                        position: 'absolute',
                                        left: 0,
                                        transition: 'opacity 0.2s',
                                        opacity: 1,
                                    },
                                    '& .hover-icon': {
                                        position: 'absolute',
                                        left: 0,
                                        transition: 'opacity 0.2s',
                                        opacity: 0,
                                    },
                                    '&:hover .default-icon': {
                                        opacity: 0,
                                    },
                                    '&:hover .hover-icon': {
                                        opacity: 1,
                                    },
                                    paddingLeft: '32px',
                                }}
                                onClick={() => navigate('/')}
                            >
                                <HomeIcon className="default-icon" />
                                <CottageIcon className="hover-icon" />
                                <span style={{ marginLeft: '8px' }}>Home</span>
                            </Button>
                            <Button
                                color="inherit"
                                onClick={() => navigate('/settings')}
                                sx={{
                                    '&:hover .rotate-icon': {
                                        transform: 'rotate(45deg)',
                                    },
                                    '& .rotate-icon': {
                                        transition: 'transform 0.3s ease-in-out',
                                        display: 'inline-flex',
                                    },
                                }}
                                startIcon={<span className="rotate-icon"><SettingsIcon /></span>}
                            >
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