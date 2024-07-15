import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Button,
  Snackbar,
  MenuItem,
} from '@mui/material';

const AppointmentForm = ({ addAppointment }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    day: '',
    time: '',
    description: '',
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          fetch('https://backendgrupo3.azurewebsites.net/pacientes'),
          fetch('https://backendgrupo3.azurewebsites.net/medicos'),
        ]);

        if (!patientsRes.ok || !doctorsRes.ok) {
          throw new Error('Error fetching data');
        }

        const [patientsData, doctorsData] = await Promise.all([
          patientsRes.json(),
          doctorsRes.json(),
        ]);

        setPatients(patientsData.map(patient => ({
          id: patient.Id_Paciente,
          nombre: patient.Nombre_Apellido_Paciente,
        })));

        setDoctors(doctorsData.map(doctor => ({
          id: doctor.Id_Medico,
          nombre: doctor.Nombre_Apellido_Medico,
        })));
      } catch (error) {
        console.error('Error fetching patients and doctors:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { patientId, doctorId, day, time, description } = formData;

    if (!patientId || !doctorId || !day || !time || !description) {
      setSnackbar({ open: true, message: 'Por favor complete todos los campos.' });
      return;
    }

    const appointmentData = {
      Id_Paciente: parseInt(patientId),
      Id_Medico: parseInt(doctorId),
      Fecha_Cita: day,
      Hora_Cita: `${day}T${time}:00.000Z`,
      Descripcion_Cita: description,
    };

    try {
      const response = await fetch('https://backendgrupo3.azurewebsites.net/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error('Error al registrar la cita');
      }

      const appointmentJson = await response.json();
      addAppointment(appointmentJson);

      setSnackbar({ open: true, message: 'Cita registrada correctamente' });
      setFormData({ patientId: '', doctorId: '', day: '', time: '', description: '' });
    } catch (error) {
      console.error('Error al registrar la cita:', error.message);
      setSnackbar({ open: true, message: 'Error al registrar la cita. Por favor, inténtelo de nuevo.' });
    }
  };

  const closeSnackbar = () => setSnackbar({ open: false, message: '' });

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>Citas</Typography>
      <br/>
      <br/>
      <Grid container spacing={2}>
        {[
          { label: 'Paciente', name: 'patientId', value: formData.patientId, options: patients },
          { label: 'Doctor', name: 'doctorId', value: formData.doctorId, options: doctors },
        ].map(({ label, name, value, options }) => (
          <Grid item xs={4} key={name}>
            <TextField
              label={label}
              select
              fullWidth
              name={name}
              value={value}
              onChange={handleChange}
              required
            >
              {options.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        ))}
        <Grid item xs={4}>
          <TextField
            label="Día"
            type="date"
            fullWidth
            name="day"
            value={formData.day}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Hora"
            select
            fullWidth
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          >
            {times.map(timeOption => (
              <MenuItem key={timeOption} value={timeOption}>
                {timeOption}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Descripción"
            fullWidth
            multiline
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'right' }}>
          <Button type="submit" variant="contained" color="primary">Registrar cita</Button>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </form>
  );
};

export default AppointmentForm;
