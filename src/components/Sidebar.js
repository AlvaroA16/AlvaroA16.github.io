// src/components/Sidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemText, Box } from '@mui/material';
import logo from '../Logo.png';

const Sidebar = ({ setSelectedTab }) => {
    return (
        <Drawer
            variant="permanent"
            anchor="left"
            PaperProps={{
                sx: { width: 240, backgroundColor: '#005f73', color: 'white' }
            }}
        >
            <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={logo} alt="Podología Laser" style={{ width: '80%', marginBottom: '20px' }} />
            </Box>
            <List>
                <ListItem button onClick={() => setSelectedTab('registroP')}>
                    <ListItemText primary="Registro paciente" />
                </ListItem>
                <ListItem button onClick={() => setSelectedTab('registroM')}>
                    <ListItemText primary="Registro médico" />
                </ListItem>
                <ListItem button onClick={() => setSelectedTab('citas')}>
                    <ListItemText primary="Citas" />
                </ListItem>
                <ListItem button onClick={() => setSelectedTab('receta')}>
                    <ListItemText primary="Receta" />
                </ListItem>
                <ListItem button onClick={() => setSelectedTab('boleta')}>
                    <ListItemText primary="Boleta" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
