# Hook useIBGEData

Hook personalizado para buscar dados de estados e cidades do Brasil através da API do IBGE.

## Funcionalidades

- ✅ Busca automática de todos os estados brasileiros
- ✅ Busca de cidades por estado selecionado
- ✅ Estados de loading para UX
- ✅ Fallback para dados offline em caso de erro de rede
- ✅ Ordenação automática por nome
- ✅ Cache de dados durante a sessão

## Uso

```typescript
import { useIBGEData } from '../hooks/useIBGEData';

const MyComponent = () => {
  const {
    states,           // Array de estados do Brasil
    cities,           // Array de cidades do estado selecionado
    loadingStates,    // Boolean: carregando estados
    loadingCities,    // Boolean: carregando cidades
    fetchCitiesByState, // Function: buscar cidades por ID do estado
    clearCities       // Function: limpar lista de cidades
  } = useIBGEData();

  // Estados são carregados automaticamente
  // Para buscar cidades:
  const handleStateSelect = (state) => {
    fetchCitiesByState(state.id);
  };

  return (
    // Sua interface aqui
  );
};
```

## API do IBGE

- **Estados**: `https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`
- **Cidades**: `https://servicodados.ibge.gov.br/api/v1/localidades/estados/{stateId}/municipios?orderBy=nome`

## Tipos

```typescript
interface IBGEState {
  id: number;
  sigla: string; // Ex: "SP", "RJ"
  nome: string; // Ex: "São Paulo", "Rio de Janeiro"
}

interface IBGECity {
  id: number;
  nome: string; // Ex: "São Paulo", "Campinas"
}
```
