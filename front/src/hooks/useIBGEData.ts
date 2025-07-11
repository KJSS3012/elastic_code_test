import { useState, useEffect, useCallback } from 'react';

export interface IBGEState {
  id: number;
  sigla: string;
  nome: string;
}

export interface IBGECity {
  id: number;
  nome: string;
}

export const useIBGEData = () => {
  const [states, setStates] = useState<IBGEState[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Buscar estados
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const response = await fetch(
          'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
        );

        if (!response.ok) {
          throw new Error('Falha ao buscar estados');
        }

        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error('Erro ao buscar estados do IBGE:', error);
        // Fallback para estados hard-coded em caso de erro
        setStates([
          { id: 11, sigla: 'RO', nome: 'Rondônia' },
          { id: 12, sigla: 'AC', nome: 'Acre' },
          { id: 13, sigla: 'AM', nome: 'Amazonas' },
          { id: 14, sigla: 'RR', nome: 'Roraima' },
          { id: 15, sigla: 'PA', nome: 'Pará' },
          { id: 16, sigla: 'AP', nome: 'Amapá' },
          { id: 17, sigla: 'TO', nome: 'Tocantins' },
          { id: 21, sigla: 'MA', nome: 'Maranhão' },
          { id: 22, sigla: 'PI', nome: 'Piauí' },
          { id: 23, sigla: 'CE', nome: 'Ceará' },
          { id: 24, sigla: 'RN', nome: 'Rio Grande do Norte' },
          { id: 25, sigla: 'PB', nome: 'Paraíba' },
          { id: 26, sigla: 'PE', nome: 'Pernambuco' },
          { id: 27, sigla: 'AL', nome: 'Alagoas' },
          { id: 28, sigla: 'SE', nome: 'Sergipe' },
          { id: 29, sigla: 'BA', nome: 'Bahia' },
          { id: 31, sigla: 'MG', nome: 'Minas Gerais' },
          { id: 32, sigla: 'ES', nome: 'Espírito Santo' },
          { id: 33, sigla: 'RJ', nome: 'Rio de Janeiro' },
          { id: 35, sigla: 'SP', nome: 'São Paulo' },
          { id: 41, sigla: 'PR', nome: 'Paraná' },
          { id: 42, sigla: 'SC', nome: 'Santa Catarina' },
          { id: 43, sigla: 'RS', nome: 'Rio Grande do Sul' },
          { id: 50, sigla: 'MS', nome: 'Mato Grosso do Sul' },
          { id: 51, sigla: 'MT', nome: 'Mato Grosso' },
          { id: 52, sigla: 'GO', nome: 'Goiás' },
          { id: 53, sigla: 'DF', nome: 'Distrito Federal' }
        ]);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  // Buscar cidades por estado
  const fetchCitiesByState = useCallback(async (stateId: number) => {
    setLoadingCities(true);
    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios?orderBy=nome`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar cidades');
      }

      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Erro ao buscar cidades do IBGE:', error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  }, []);

  const clearCities = useCallback(() => {
    setCities([]);
  }, []);

  return {
    states,
    cities,
    loadingStates,
    loadingCities,
    fetchCitiesByState,
    clearCities
  };
};
