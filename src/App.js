// src/App.js
import React, { useState } from 'react';
import { CssBaseline, Box } from '@mui/material';
import PatientForm from './components/PacienteForm';
import DoctorForm from './components/DoctorForm';
import AppointmentForm from './components/CitaForm';
import PrescriptionForm from './components/PrescripcionForm';
import Boleta from './components/Boleta'; // Importa el componente Boleta
import Sidebar from './components/Sidebar';
import './App.css';

const App = () => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedTab, setSelectedTab] = useState('registro');

    const addPatient = (patient) => {
        setPatients([...patients, patient]);
    };

    const addDoctor = (doctor) => {
        setDoctors([...doctors, doctor]);
    };

    const addAppointment = (appointment) => {
        setAppointments([...appointments, appointment]);
    };

    const addPrescription = (prescription) => {
        setPrescriptions([...prescriptions, prescription]);
    };

    return (
        <div className="app-container">
            <CssBaseline />
            <Sidebar setSelectedTab={setSelectedTab} />
            <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: 30 }}>
                {selectedTab === 'registroP' && <PatientForm addPatient={addPatient} />}
                {selectedTab === 'registroM' && <DoctorForm addDoctor={addDoctor} />}
                {selectedTab === 'citas' && <AppointmentForm addAppointment={addAppointment} />}
                {selectedTab === 'receta' && <PrescriptionForm addPrescription={addPrescription} />}
                {selectedTab === 'boleta' && <Boleta />} {/* Añade el componente Boleta */}
            </Box>
        </div>
    );
};

export default App;
