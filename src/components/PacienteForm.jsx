import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';

const PatientForm = () => {
    const [patient, setPatient] = useState({
        nombreApellido: '',
        correo: '',
        telefono: '',
        dni: '',
        edad: '',
    });

    const [errors, setErrors] = useState({
        telefonoError: '',
        dniError: '',
    });

    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9]{9}$/;
        if (!phoneRegex.test(phone)) {
            setErrors(prevErrors => ({ ...prevErrors, telefonoError: 'El número de teléfono debe tener 9 dígitos.' }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, telefonoError: '' }));
        return true;
    };

    const validateDni = (dni) => {
        const dniRegex = /^[1-9][0-9]{7}$/;
        if (!dniRegex.test(dni)) {
            setErrors(prevErrors => ({ ...prevErrors, dniError: 'El DNI debe tener 8 dígitos y no debe empezar por 0.' }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, dniError: '' }));
        return true;
    };

    const addPatient = async () => {
        const { nombreApellido, correo, telefono, dni, edad } = patient;

        if (!validatePhone(telefono) || !validateDni(dni)) {
            return;
        }

        const patientData = {
            Nombre_Apellido_Paciente: nombreApellido,
            Correo_Electronico_Paciente: correo,
            Telefono_Paciente: telefono,
            DNI: dni,
            Edad: parseInt(edad),
        };

        try {
            const response = await fetch('https://backendgrupo3.azurewebsites.net/pacientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(patientData),
            });

            if (!response.ok) {
                throw new Error('Error al registrar el paciente');
            }

            alert('Paciente registrado satisfactoriamente');
            // Limpiar los campos después de éxito
            setPatient({
                nombreApellido: '',
                correo: '',
                telefono: '',
                dni: '',
                edad: '',
            });
        } catch (error) {
            console.error('Hubo un error al registrar el paciente:', error.message);
            alert('Hubo un error al registrar el paciente');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatient(prevPatient => ({ ...prevPatient, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addPatient();
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: 20 }}>
            <Typography variant="h4" gutterBottom>
                Registro de pacientes
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        label="Nombre y apellido"
                        name="nombreApellido"
                        fullWidth
                        value={patient.nombreApellido}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Edad"
                        type="number"
                        name="edad"
                        fullWidth
                        value={patient.edad}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Teléfono"
                        name="telefono"
                        fullWidth
                        value={patient.telefono}
                        onChange={handleChange}
                        error={!!errors.telefonoError}
                        helperText={errors.telefonoError}
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="DNI"
                        name="dni"
                        fullWidth
                        value={patient.dni}
                        onChange={handleChange}
                        error={!!errors.dniError}
                        helperText={errors.dniError}
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Correo"
                        type="email"
                        name="correo"
                        fullWidth
                        value={patient.correo}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12} style={{ textAlign: 'right' }}>
                    <Button type="submit" variant="contained" color="primary">
                        Registrar
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default PatientForm;
