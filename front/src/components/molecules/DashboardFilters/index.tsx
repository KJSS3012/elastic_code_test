import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Autocomplete,
  Chip,
  CircularProgress
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import type { DashboardFilters } from '../../../types/dashboard';
import { useIBGEData, type IBGEState, type IBGECity } from '../../../hooks/useIBGEData';

interface DashboardFiltersComponentProps {
  onFiltersChange: (filters: DashboardFilters) => void;
  currentFilters: DashboardFilters;
}

// Estados e cidades brasileiras comuns para autocomplete
// Removido - agora usando dados do IBGE

// Anos disponíveis para seleção
const AVAILABLE_YEARS = Array.from({ length: 10 }, (_, i) => {
  const currentYear = new Date().getFullYear();
  return currentYear - i;
});

export const DashboardFiltersComponent: React.FC<DashboardFiltersComponentProps> = ({
  onFiltersChange,
  currentFilters
}) => {
  const [localFilters, setLocalFilters] = useState<DashboardFilters>(currentFilters);
  const [selectedState, setSelectedState] = useState<IBGEState | null>(null);
  const [selectedCity, setSelectedCity] = useState<IBGECity | null>(null);

  const {
    states,
    cities,
    loadingStates,
    loadingCities,
    fetchCitiesByState,
    clearCities
  } = useIBGEData();

  // Inicializar estados selecionados baseado nos filtros atuais
  useEffect(() => {
    if (currentFilters.state && states.length > 0) {
      const state = states.find(s => s.sigla === currentFilters.state);
      if (state) {
        setSelectedState(state);
        if (currentFilters.city) {
          fetchCitiesByState(state.id);
        }
      }
    }
  }, [currentFilters.state, states, fetchCitiesByState, currentFilters.city]);

  useEffect(() => {
    if (currentFilters.city && cities.length > 0) {
      const city = cities.find(c => c.nome === currentFilters.city);
      setSelectedCity(city || null);
    }
  }, [currentFilters.city, cities]);

  const handleFilterChange = (key: keyof DashboardFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleStateChange = (state: IBGEState | null) => {
    setSelectedState(state);
    setSelectedCity(null);
    clearCities();

    if (state) {
      handleFilterChange('state', state.sigla);
      handleFilterChange('city', undefined);
      fetchCitiesByState(state.id);
    } else {
      handleFilterChange('state', undefined);
      handleFilterChange('city', undefined);
    }
  };

  const handleCityChange = (city: IBGECity | null) => {
    setSelectedCity(city);
    handleFilterChange('city', city?.nome || undefined);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    const emptyFilters: DashboardFilters = {};
    setLocalFilters(emptyFilters);
    setSelectedState(null);
    setSelectedCity(null);
    clearCities();
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== undefined && value !== '');

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon />
          Filtros do Dashboard
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Autocomplete
              options={states}
              value={selectedState}
              onChange={(_, value) => handleStateChange(value)}
              getOptionLabel={(option) => `${option.nome} (${option.sigla})`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={loadingStates}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Estado"
                  size="small"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingStates ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Autocomplete
              options={cities}
              value={selectedCity}
              onChange={(_, value) => handleCityChange(value)}
              getOptionLabel={(option) => option.nome}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={loadingCities}
              disabled={!selectedState}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cidade"
                  size="small"
                  fullWidth
                  placeholder={selectedState ? "Selecione uma cidade" : "Selecione um estado primeiro"}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingCities ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Autocomplete
              options={AVAILABLE_YEARS}
              value={localFilters.year || null}
              onChange={(_, value) => handleFilterChange('year', value || undefined)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ano"
                  size="small"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                onClick={applyFilters}
                startIcon={<FilterListIcon />}
                size="small"
                fullWidth
              >
                Aplicar
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  startIcon={<ClearIcon />}
                  size="small"
                  color="secondary"
                >
                  Limpar
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Chips dos filtros ativos */}
        {hasActiveFilters && (
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Filtros ativos:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {selectedState && (
                <Chip
                  label={`Estado: ${selectedState.nome} (${selectedState.sigla})`}
                  onDelete={() => handleStateChange(null)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedCity && (
                <Chip
                  label={`Cidade: ${selectedCity.nome}`}
                  onDelete={() => handleCityChange(null)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {localFilters.year && (
                <Chip
                  label={`Ano: ${localFilters.year}`}
                  onDelete={() => handleFilterChange('year', undefined)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
