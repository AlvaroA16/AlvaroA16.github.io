import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, MenuItem } from '@mui/material';

const DoctorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
  });

  const [phoneError, setPhoneError] = useState('');

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('El número de teléfono debe tener 9 dígitos.');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhone(formData.phone)) {
      return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];


    const doctorData = {
      Nombre_Apellido_Medico: formData.name,
      Correo_Electronico_Medico: formData.email,
      Telefono_Medico: formData.phone,
      Especialidad: formData.specialty,
      Disponibilidad: formattedDate,
    };

    try {
      const response = await fetch('https://backendgrupo3.azurewebsites.net/medicos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
      });

      if (!response.ok) {
        throw new Error('Error al registrar el médico');
      }

      alert('Médico registrado satisfactoriamente');
      setFormData({ name: '', email: '', phone: '', specialty: '' });
    } catch (error) {
      console.error('Hubo un error al registrar el médico:', error.message);
      alert('Hubo un error al registrar el médico');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Registro de médicos
      </Typography>
      <br/>
      <br/>
      <Grid container spacing={2}>
        {[
          { label: 'Nombre y apellido', name: 'name', value: formData.name },
          { label: 'Correo', name: 'email', value: formData.email },
          { label: 'Teléfono', name: 'phone', value: formData.phone, error: !!phoneError, helperText: phoneError },
          {
            label: 'Especialidad', name: 'specialty', value: formData.specialty, select: true, options: [{ value: 'Podólogo', label: 'Podólogo' }],
          },
        ].map((field, index) => (
          <Grid item xs={6} key={index}>
            <TextField
              label={field.label}
              fullWidth
              name={field.name}
              value={field.value}
              onChange={handleChange}
              error={field.error}
              helperText={field.helperText}
              required
              select={field.select}
            >
              {field.select && field.options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        ))}
        <Grid item xs={12} style={{ textAlign: 'right' }}>
          <Button type="submit" variant="contained" color="primary">
            Registrar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default DoctorForm;
