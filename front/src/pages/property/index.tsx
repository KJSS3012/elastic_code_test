import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../stores/store';
import { addFarmToProducer, type Farm } from '../../stores/producer/slice';
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

const propertySchema = z.object({
  producer_id: z.string().min(1, 'Selecione um produtor'),
  farm_name: z.string().min(1, 'O nome da fazenda é obrigatório.'),
  city: z.string().min(1, 'A cidade é obrigatória.'),
  state: z.string().min(2, 'O estado é obrigatório.').max(2, 'Use a sigla do estado (ex: SP).'),
  total_area_ha: z.coerce.number().min(0.1, 'A área total deve ser maior que zero.'),
  arable_area_ha: z.coerce.number().min(0, 'A área agricultável não pode ser negativa.'),
  vegetation_area_ha: z.coerce.number().min(0, 'A área de vegetação não pode ser negativa.'),
}).refine(data => data.arable_area_ha + data.vegetation_area_ha <= data.total_area_ha, {
  message: 'A soma da área agricultável e de vegetação não pode ser maior que a área total.',
  path: ['arable_area_ha'],
});

type PropertyFormData = z.infer<typeof propertySchema>;

const PropertyCreate: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const producers = useSelector((state: RootState) => state.producerReducer.producers);

  const { control, handleSubmit, formState: { errors } } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      producer_id: '',
      farm_name: '',
      city: '',
      state: '',
      total_area_ha: 0,
      arable_area_ha: 0,
      vegetation_area_ha: 0,
    }
  });

  const onSubmit = (data: PropertyFormData) => {
    const newFarm: Farm = {
      id: Date.now().toString(),
      farm_name: data.farm_name,
      city: data.city,
      state: data.state,
      total_area_ha: data.total_area_ha,
      arable_area_ha: data.arable_area_ha,
      vegetation_area_ha: data.vegetation_area_ha,
      harvests: []
    };

    dispatch(addFarmToProducer({
      producerId: data.producer_id,
      farm: newFarm
    }));

    alert('Propriedade criada com sucesso!');
    navigate('/properties');
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cadastrar Nova Propriedade
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="producer_id"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.producer_id}>
                    <InputLabel>Produtor</InputLabel>
                    <Select {...field} label="Produtor">
                      {producers.map((producer) => (
                        <MenuItem key={producer.id} value={producer.id}>
                          {producer.producer_name} - {producer.document}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.producer_id && (
                      <Typography variant="caption" color="error">
                        {errors.producer_id.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="farm_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nome da Fazenda"
                    variant="outlined"
                    fullWidth
                    required
                    error={!!errors.farm_name}
                    helperText={errors.farm_name?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cidade"
                    variant="outlined"
                    fullWidth
                    required
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Estado (UF)"
                    variant="outlined"
                    fullWidth
                    required
                    inputProps={{ maxLength: 2 }}
                    error={!!errors.state}
                    helperText={errors.state?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="total_area_ha"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Área Total (hectares)"
                    variant="outlined"
                    type="number"
                    fullWidth
                    required
                    error={!!errors.total_area_ha}
                    helperText={errors.total_area_ha?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="arable_area_ha"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Área Agricultável (ha)"
                    variant="outlined"
                    type="number"
                    fullWidth
                    required
                    error={!!errors.arable_area_ha}
                    helperText={errors.arable_area_ha?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="vegetation_area_ha"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Área de Vegetação (ha)"
                    variant="outlined"
                    type="number"
                    fullWidth
                    required
                    error={!!errors.vegetation_area_ha}
                    helperText={errors.vegetation_area_ha?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button type="submit" variant="contained" color="primary" size="large">
                Cadastrar Propriedade
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container >
  );
};

export default PropertyCreate;