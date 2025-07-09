const API_BASE_URL = 'http://localhost:3000';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  total?: number;
  page?: number;
  lastPage?: number;
}

// Callback para lidar com logout quando há erro 401
let onUnauthorizedCallback: (() => void) | null = null;

export const setUnauthorizedCallback = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

class ApiService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      // Se for erro 401 (Unauthorized), limpar o token e lançar erro específico
      if (response.status === 401) {
        localStorage.removeItem('token');
        // Chamar callback para lidar com logout imediatamente
        if (onUnauthorizedCallback) {
          onUnauthorizedCallback();
        }
        throw new Error('UNAUTHORIZED');
      } try {
        const errorData = await response.json();

        // O backend NestJS pode retornar diferentes formatos de erro
        let errorMessage = '';

        if (errorData.message) {
          if (Array.isArray(errorData.message)) {
            errorMessage = errorData.message.join(', ');
          } else {
            errorMessage = errorData.message;
          }
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else {
          errorMessage = `Request failed with status ${response.status}`;
        }

        throw new Error(errorMessage);
      } catch (parseError) {
        // Verificar se o erro é de parsing JSON ou se é o erro que já lançamos
        if (parseError instanceof Error && !parseError.message.includes('Request failed with status')) {
          throw parseError; // Re-throw o erro que já processamos
        }
        // Se realmente falhou o parsing do JSON, usar erro genérico
        throw new Error(`Request failed with status ${response.status}`);
      }
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    return this.request<any>('/farmers', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request<any>('/auth/profile');
  }

  // Admin endpoints
  async getAdminDashboardStats(filters?: { state?: string; city?: string; year?: number }) {
    const queryParams = new URLSearchParams();
    if (filters?.state) queryParams.append('state', filters.state);
    if (filters?.city) queryParams.append('city', filters.city);
    if (filters?.year) queryParams.append('year', filters.year.toString());

    const query = queryParams.toString();
    return this.request<any>(`/dashboard/admin-stats${query ? `?${query}` : ''}`);
  }

  async getAllFarmersWithProperties() {
    return this.request<any>('/farmers/with-properties');
  }

  // Farmers management (Admin only)
  async getAllFarmers(params?: { page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return this.request<any>(`/farmers${query ? `?${query}` : ''}`);
  }

  async createFarmer(data: any) {
    return this.request<any>('/farmers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFarmer(id: string, data: any) {
    return this.request<any>(`/farmers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteFarmer(id: string) {
    return this.request<any>(`/farmers/${id}`, {
      method: 'DELETE',
    });
  }

  // Farmer endpoints
  async getFarmerDashboardStats(filters?: { state?: string; city?: string; year?: number }) {
    const queryParams = new URLSearchParams();
    if (filters?.state) queryParams.append('state', filters.state);
    if (filters?.city) queryParams.append('city', filters.city);
    if (filters?.year) queryParams.append('year', filters.year.toString());

    const query = queryParams.toString();
    return this.request<any>(`/dashboard/farmer-stats${query ? `?${query}` : ''}`);
  }

  async getMyProperties() {
    return this.request<any[]>('/properties');
  }

  async getMyProfile() {
    return this.request<any>('/auth/profile');
  }

  async updateMyProfile(data: any) {
    // Para atualizar o perfil, precisamos usar o endpoint de farmers
    // mas primeiro precisamos obter o ID do usuário atual
    const profileResponse = await this.getCurrentUser();
    const profileId = (profileResponse as any).id;
    return this.request<any>(`/farmers/${profileId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Properties (accessible by both farmers and admins)
  async createProperty(data: any) {
    return this.request<any>('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProperty(id: string, data: any) {
    return this.request<any>(`/properties/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProperty(id: string) {
    return this.request<any>(`/properties/${id}`, { method: 'DELETE' });
  }

  // Harvests
  async createHarvest(propertyId: string, data: any) {
    return this.request<any>(`/properties/${propertyId}/harvests`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateHarvest(propertyId: string, harvestId: string, data: any) {
    return this.request<any>(`/properties/${propertyId}/harvests/${harvestId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteHarvest(propertyId: string, harvestId: string) {
    return this.request<any>(`/properties/${propertyId}/harvests/${harvestId}`, {
      method: 'DELETE',
    });
  }

  // Crops
  async createCrop(harvestId: string, data: any) {
    return this.request<any>(`/harvests/${harvestId}/crops`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteCrop(harvestId: string, cropId: string) {
    return this.request<any>(`/harvests/${harvestId}/crops/${cropId}`, {
      method: 'DELETE',
    });
  }

  // Harvest and Crop management
  async addHarvestCrop(propertyId: string, data: any) {
    return this.request<any>(`/properties/${propertyId}/harvest-crop`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removeHarvest(propertyId: string, harvestId: string) {
    return this.request<any>(`/properties/${propertyId}/harvest/${harvestId}`, {
      method: 'DELETE',
    });
  }

  async removeCrop(propertyId: string, harvestId: string, cropId: string) {
    return this.request<any>(`/properties/${propertyId}/harvest/${harvestId}/crop/${cropId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
