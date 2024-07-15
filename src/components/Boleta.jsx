import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';

const Boleta = () => {
    const [patient, setPatient] = useState('');
    const [dni, setDni] = useState('');
    const [doctor, setDoctor] = useState('');
    const [consultCost, setConsultCost] = useState('');
    const [procedureCost, setProcedureCost] = useState('');
    const [prescriptionDescription, setPrescriptionDescription] = useState('');
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch('https://backendgrupo3.azurewebsites.net/pacientes');
                if (!response.ok) {
                    throw new Error('Error al obtener la lista de pacientes');
                }
                const data = await response.json();
                setPatients(data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        const fetchDoctors = async () => {
            try {
                const response = await fetch('https://backendgrupo3.azurewebsites.net/medicos');
                if (!response.ok) {
                    throw new Error('Error al obtener la lista de médicos');
                }
                const data = await response.json();
                setDoctors(data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchPatients();
        fetchDoctors();
    }, []);

    const handlePatientChange = (e) => {
        const selectedPatient = e.target.value;
        const foundPatient = patients.find(patient => patient.Nombre_Apellido_Paciente === selectedPatient);
        if (foundPatient) {
            setPatient(foundPatient.Nombre_Apellido_Paciente);
            setDni(foundPatient.DNI);
            setConsultCost(foundPatient.Costo_Consulta || '');
            setPrescriptionDescription(foundPatient.Descripcion_Receta || '');
        }
    };

    const handleDoctorChange = (e) => {
        const selectedDoctor = e.target.value;
        const foundDoctor = doctors.find(doctor => doctor.Nombre_Apellido_Medico === selectedDoctor);
        if (foundDoctor) {
            setDoctor(foundDoctor.Nombre_Apellido_Medico);
            setProcedureCost(foundDoctor.Costo_Procedimiento || '');
        }
    };

    const handleBoletaRegistration = async () => {
        if (!dni || !patient || !doctor || !consultCost || !procedureCost || !prescriptionDescription) {
            mostrarSnackbar('Todos los campos son requeridos', 'error');
            return;
        }

        const boletaData = {
            DNI: dni.toString(), // Convertir DNI a string
            Nombre_Apellido_Paciente: patient,
            Costo_Consulta: parseFloat(consultCost),
            Costo_Procedimiento: parseFloat(procedureCost),
            Nombre_Apellido_Medico: doctor,
            Descripcion_Receta: prescriptionDescription,
        };
    

        console.log('Datos de la boleta:', boletaData);

        try {
            const response = await fetch('https://backendgrupo3.azurewebsites.net/boletas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(boletaData),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Error al registrar la boleta:', errorResponse);
                mostrarSnackbar(`Error al registrar la boleta: ${errorResponse.message || 'Error desconocido'}`, 'error');
                return;
            }

            setPatient('');
            setDni('');
            setDoctor('');
            setConsultCost('');
            setProcedureCost('');
            setPrescriptionDescription('');

            console.log('Boleta registrada correctamente:', boletaData);
            mostrarSnackbar('Boleta registrada correctamente', 'success');
        } catch (error) {
            console.error('Error al registrar la boleta:', error);
            mostrarSnackbar('Error al registrar la boleta. Por favor, inténtelo de nuevo.', 'error');
        }
    };

    const mostrarSnackbar = (mensaje, severity) => {
        setSnackbarMessage(mensaje);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const cerrarSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h4" gutterBottom>
                Registro de Boleta
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel>Paciente</InputLabel>
                        <Select value={patient} onChange={handlePatientChange}>
                            {patients.map((paciente) => (
                                <MenuItem key={paciente.Id_Paciente} value={paciente.Nombre_Apellido_Paciente}>
                                    {paciente.Nombre_Apellido_Paciente}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <TextField label="DNI" fullWidth value={dni} disabled />
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel>Médico</InputLabel>
                        <Select value={doctor} onChange={handleDoctorChange}>
                            {doctors.map((doctor) => (
                                <MenuItem key={doctor.Id_Medico} value={doctor.Nombre_Apellido_Medico}>
                                    {doctor.Nombre_Apellido_Medico}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Costo de consulta"
                        fullWidth
                        type="number"
                        value={consultCost}
                        onChange={(e) => setConsultCost(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Costo de Procedimiento"
                        fullWidth
                        type="number"
                        value={procedureCost}
                        onChange={(e) => setProcedureCost(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Descripción de la boleta"
                        fullWidth
                        multiline
                        rows={4}
                        value={prescriptionDescription}
                        onChange={(e) => setPrescriptionDescription(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} style={{ textAlign: 'right' }}>
                    <Button variant="contained" color="secondary" onClick={handleBoletaRegistration}>
                        Registrar Boleta
                    </Button>
                </Grid>
            </Grid>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={cerrarSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={cerrarSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Boleta;
