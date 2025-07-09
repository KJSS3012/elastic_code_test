import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Box
} from '@mui/material';
import { ibgeService, type Estado, type Cidade } from '../../services/ibge';

interface LocationSelectProps {
  state: string;
  city: string;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  stateError?: string;
  cityError?: string;
  disabled?: boolean;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  state,
  city,
  onStateChange,
  onCityChange,
  stateError,
  cityError,
  disabled = false
}) => {
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [loadingEstados, setLoadingEstados] = useState(false);
  const [loadingCidades, setLoadingCidades] = useState(false);

  // Carregar estados ao montar o componente
  useEffect(() => {
    const loadEstados = async () => {
      setLoadingEstados(true);
      try {
        const estadosData = await ibgeService.getEstados();
        setEstados(estadosData);
      } catch (error) {
        console.error('Erro ao carregar estados:', error);
      } finally {
        setLoadingEstados(false);
      }
    };

    loadEstados();
  }, []);

  // Carregar cidades quando o estado muda
  useEffect(() => {
    if (state) {
      const loadCidades = async () => {
        setLoadingCidades(true);
        try {
          const cidadesData = await ibgeService.getCidadesPorEstado(state);
          setCidades(cidadesData);
        } catch (error) {
          console.error('Erro ao carregar cidades:', error);
          setCidades([]);
        } finally {
          setLoadingCidades(false);
        }
      };

      loadCidades();
    } else {
      setCidades([]);
      onCityChange(''); // Limpar cidade quando estado é limpo
    }
  }, [state, onCityChange]);

  const handleStateChange = (newState: string) => {
    onStateChange(newState);
    onCityChange(''); // Limpar cidade quando estado muda
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
      {/* Select de Estado */}
      <FormControl fullWidth error={!!stateError} disabled={disabled}>
        <InputLabel id="state-select-label">Estado</InputLabel>
        <Select
          labelId="state-select-label"
          value={state}
          label="Estado"
          onChange={(e) => handleStateChange(e.target.value)}
          endAdornment={
            loadingEstados && (
              <CircularProgress size={20} sx={{ mr: 2 }} />
            )
          }
        >
          <MenuItem value="">
            <em>Selecione um estado</em>
          </MenuItem>
          {estados.map((estado) => (
            <MenuItem key={estado.sigla} value={estado.sigla}>
              {estado.nome} ({estado.sigla})
            </MenuItem>
          ))}
        </Select>
        {stateError && <FormHelperText>{stateError}</FormHelperText>}
      </FormControl>

      {/* Select de Cidade */}
      <FormControl fullWidth error={!!cityError} disabled={disabled || !state}>
        <InputLabel id="city-select-label">Cidade</InputLabel>
        <Select
          labelId="city-select-label"
          value={city}
          label="Cidade"
          onChange={(e) => onCityChange(e.target.value)}
          endAdornment={
            loadingCidades && (
              <CircularProgress size={20} sx={{ mr: 2 }} />
            )
          }
        >
          <MenuItem value="">
            <em>Selecione uma cidade</em>
          </MenuItem>
          {cidades.map((cidade) => (
            <MenuItem key={cidade.id} value={cidade.nome}>
              {cidade.nome}
            </MenuItem>
          ))}
        </Select>
        {cityError && <FormHelperText>{cityError}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default LocationSelect;
