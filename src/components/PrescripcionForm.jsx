import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';

const PrescriptionForm = ({ addPrescription }) => {
    const [patient, setPatient] = useState('');
    const [medicationType, setMedicationType] = useState('');
    const [medication, setMedication] = useState('');
    const [description, setDescription] = useState('');
    const [patients, setPatients] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Cambiado a 'success' por defecto

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

        fetchPatients();
    }, []);

    const handleRegisterPrescription = async () => {
        if (!patient || !medicationType || !medication || !description) {
            mostrarSnackbar('Por favor complete todos los campos.');
            return;
        }

        const prescriptionData = {
            
            Nombre_Medicamento: medication,
            Tipo_Medicamento: medicationType,
            Descripcion_Receta: description,
            Id_Paciente: patient,
        };

        try {
            const response = await fetch('https://backendgrupo3.azurewebsites.net/recetas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(prescriptionData),
            });

            if (!response.ok) {
                throw new Error('Error al registrar la receta');
            }

            const prescriptionJson = await response.json();
            addPrescription(prescriptionJson);

            mostrarSnackbar('Receta registrada correctamente'); // Mensaje de éxito
            setMedicationType('');
            setMedication('');
            setDescription('');
        } catch (error) {
            console.error('Error al registrar la receta:', error);
            mostrarSnackbar('Error al registrar la receta. Por favor, inténtelo de nuevo.');
        }
    };

    const handlePatientChange = (e) => {
        setPatient(e.target.value);
    };

    const mostrarSnackbar = (mensaje) => {
        setSnackbarMessage(mensaje);
        setSnackbarSeverity('success'); // Cambiado a 'success'
        setSnackbarOpen(true);
    };

    const cerrarSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h4" gutterBottom>
                Receta
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <FormControl fullWidth required>
                        <InputLabel>Paciente</InputLabel>
                        <Select
                            value={patient}
                            onChange={handlePatientChange}
                        >
                            {patients.map((paciente) => (
                                <MenuItem key={paciente.Id_Paciente} value={paciente.Id_Paciente}>
                                    {paciente.Nombre_Apellido_Paciente}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Tipo de medicamento"
                        fullWidth
                        value={medicationType}
                        onChange={(e) => setMedicationType(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Nombre del medicamento"
                        fullWidth
                        value={medication}
                        onChange={(e) => setMedication(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Descripción"
                        fullWidth
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </Grid>
                <Grid item xs={12} style={{ textAlign: 'right' }}>
                    <Button variant="contained" color="secondary" onClick={handleRegisterPrescription}>
                        Registrar receta
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

export default PrescriptionForm;
