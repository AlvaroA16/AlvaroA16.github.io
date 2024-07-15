// src/components/Registration.js
import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import PatientForm from './PacienteForm';
import DoctorForm from './DoctorForm';

const Registration = () => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const addPatient = (patient) => {
        console.log('Registered patient:', patient);
    };

    const addDoctor = (doctor) => {
        console.log('Registered doctor:', doctor);
    };

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h4" gutterBottom>
                Registro
            </Typography>
            <Tabs value={tabIndex} onChange={handleTabChange}>
                <Tab label="Pacientes" />
                <Tab label="Médicos" />
            </Tabs>
            <Box>
                {tabIndex === 0 && <PatientForm addPatient={addPatient} />}
                {tabIndex === 1 && <DoctorForm addDoctor={addDoctor} />}
            </Box>
        </div>
    );
};

export default Registration;
