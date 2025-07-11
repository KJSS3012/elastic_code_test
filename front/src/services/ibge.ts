// Serviço para integração com a API do IBGE
export interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

export interface Cidade {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: {
        id: number;
        sigla: string;
        nome: string;
      };
    };
  };
}

class IBGEService {
  private baseUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades';

  async getEstados(): Promise<Estado[]> {
    try {
      const response = await fetch(`${this.baseUrl}/estados?orderBy=nome`);
      if (!response.ok) {
        throw new Error('Erro ao buscar estados');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
      throw error;
    }
  }

  async getCidadesPorEstado(estadoSigla: string): Promise<Cidade[]> {
    try {
      const response = await fetch(`${this.baseUrl}/estados/${estadoSigla}/municipios?orderBy=nome`);
      if (!response.ok) {
        throw new Error('Erro ao buscar cidades');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      throw error;
    }
  }
}

export const ibgeService = new IBGEService();
