const API_BASE_URL = 'http://localhost:3000';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  total?: number;
  page?: number;
  lastPage?: number;
}

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
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Farmers
  async getFarmers(page = 1, limit = 10) {
    return this.request<any[]>(`/farmers?page=${page}&limit=${limit}`);
  }

  async getFarmer(id: string) {
    return this.request<any>(`/farmers/${id}`);
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
    return this.request<any>(`/farmers/${id}`, { method: 'DELETE' });
  }

  // Properties
  async getProperties(page = 1, limit = 10) {
    return this.request<any[]>(`/properties?page=${page}&limit=${limit}`);
  }

  async getProperty(id: string) {
    return this.request<any>(`/properties/${id}`);
  }

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
  async getHarvests(page = 1, limit = 10) {
    return this.request<any[]>(`/harvests?page=${page}&limit=${limit}`);
  }

  async createHarvest(data: any) {
    return this.request<any>('/harvests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Crops
  async getCrops(page = 1, limit = 10) {
    return this.request<any[]>(`/crops?page=${page}&limit=${limit}`);
  }

  async createCrop(data: any) {
    return this.request<any>('/crops', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Dashboard
  async getDashboardStats() {
    return this.request<any>('/dashboard/stats');
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }
}

export const apiService = new ApiService();
