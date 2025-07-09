import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../stores/store';
import { createFarm } from '../../stores/producer/slice';
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import LocationSelect from '../../components/molecules/LocationSelect';

const propertySchema = z.object({
  farm_name: z.string().min(1, 'O nome da fazenda é obrigatório.'),
  city: z.string().min(1, 'A cidade é obrigatória.'),
  state: z.string().min(2, 'O estado é obrigatório.'),
  total_area_ha: z.coerce.number().min(0.1, 'A área total deve ser maior que zero.'),
  arable_area_ha: z.coerce.number().min(0, 'A área agricultável não pode ser negativa.'),
  vegetable_area_ha: z.coerce.number().min(0, 'A área de vegetação não pode ser negativa.'),
}).refine(data => data.arable_area_ha + data.vegetable_area_ha <= data.total_area_ha, {
  message: 'A soma da área agricultável e de vegetação não pode ser maior que a área total.',
  path: ['arable_area_ha'],
});

type PropertyFormData = z.infer<typeof propertySchema>;

const PropertyCreate: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.authReducer);
  const { showNotification } = useNotification();

  const [formLoading, setFormLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      farm_name: '',
      city: '',
      state: '',
      total_area_ha: 0,
      arable_area_ha: 0,
      vegetable_area_ha: 0,
    }
  });

  const watchedState = watch('state');
  const watchedCity = watch('city');

  const onSubmit = async (data: PropertyFormData) => {
    setFormLoading(true);
    setError(null);

    try {
      // Para farmers, criar propriedade diretamente
      // Para admins, seria necessário selecionar o produtor
      if (user?.role === 'farmer' && user?.id) {
        // Adicionar farmer_id do usuário logado e enviar apenas os campos necessários
        const propertyData = {
          farmer_id: user.id,
          farm_name: data.farm_name,
          city: data.city,
          state: data.state,
          total_area_ha: data.total_area_ha,
          arable_area_ha: data.arable_area_ha,
          vegetable_area_ha: data.vegetable_area_ha
        };

        await dispatch(createFarm(propertyData)).unwrap();
        showNotification('Propriedade criada com sucesso!', 'success');
        navigate('/properties');
      } else {
        setError('Funcionalidade não implementada para administradores');
        showNotification('Funcionalidade não implementada para administradores', 'error');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar propriedade';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cadastrar Nova Propriedade
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
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

            {/* Campo de Localização (Estado e Cidade) */}
            <Grid size={{ xs: 12 }}>
              <LocationSelect
                state={watchedState}
                city={watchedCity}
                onStateChange={(newState) => setValue('state', newState)}
                onCityChange={(newCity) => setValue('city', newCity)}
                stateError={errors.state?.message}
                cityError={errors.city?.message}
                disabled={formLoading}
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
                name="vegetable_area_ha"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Área de Vegetação (ha)"
                    variant="outlined"
                    type="number"
                    fullWidth
                    required
                    error={!!errors.vegetable_area_ha}
                    helperText={errors.vegetable_area_ha?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={formLoading}
                sx={{ mr: 2 }}
              >
                {formLoading ? <CircularProgress size={20} /> : 'Cadastrar Propriedade'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/properties')}
                disabled={formLoading}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default PropertyCreate;