// Mock data for testing purposes
export const mockProducers = [
  {
    id: '1',
    producer_name: 'João Silva',
    email: 'joao@fazenda.com',
    cpf: '123.456.789-00',
    cnpj: null,
    phone: '(11) 99999-1111',
    role: 'farmer',
    farms: [
      {
        id: '1',
        name: 'Fazenda São João',
        total_area_ha: 150.5,
        state: 'SP',
        city: 'Ribeirão Preto'
      }
    ]
  },
  {
    id: '2',
    producer_name: 'Maria Santos',
    email: 'maria@agro.com',
    cpf: '987.654.321-00',
    cnpj: '12.345.678/0001-90',
    phone: '(11) 88888-2222',
    role: 'farmer',
    farms: [
      {
        id: '2',
        name: 'Agro Santos',
        total_area_ha: 300.0,
        state: 'MG',
        city: 'Uberlândia'
      },
      {
        id: '3',
        name: 'Fazenda Nova',
        total_area_ha: 200.0,
        state: 'MG',
        city: 'Uberaba'
      }
    ]
  },
  {
    id: '3',
    producer_name: 'Admin Sistema',
    email: 'admin@sistema.com',
    cpf: '111.222.333-44',
    cnpj: null,
    phone: '(11) 77777-3333',
    role: 'admin',
    farms: []
  }
];

export const mockProperties = [
  {
    id: '1',
    name: 'Fazenda São João',
    total_area_ha: 150.5,
    arable_area_ha: 120.0,
    vegetation_area_ha: 30.5,
    state: 'SP',
    city: 'Ribeirão Preto',
    farmer_id: '1',
    farmer: mockProducers[0],
    harvests: [
      {
        id: '1',
        name: 'Safra Soja 2024',
        planted_area_ha: 80.0,
        harvest_date: '2024-03-15',
        productivity_per_hectare: 3200,
        property_id: '1'
      }
    ]
  },
  {
    id: '2',
    name: 'Agro Santos',
    total_area_ha: 300.0,
    arable_area_ha: 250.0,
    vegetation_area_ha: 50.0,
    state: 'MG',
    city: 'Uberlândia',
    farmer_id: '2',
    farmer: mockProducers[1],
    harvests: [
      {
        id: '2',
        name: 'Safra Milho 2024',
        planted_area_ha: 150.0,
        harvest_date: '2024-07-20',
        productivity_per_hectare: 8500,
        property_id: '2'
      }
    ]
  }
];

export const mockCrops = [
  {
    id: '1',
    name: 'Soja',
    description: 'Cultura de soja para grãos'
  },
  {
    id: '2',
    name: 'Milho',
    description: 'Cultura de milho para grãos'
  },
  {
    id: '3',
    name: 'Café',
    description: 'Cultura de café arábica'
  }
];

export const mockHarvests = [
  {
    id: '1',
    name: 'Safra Soja 2024',
    planted_area_ha: 80.0,
    harvest_date: '2024-03-15',
    productivity_per_hectare: 3200,
    property_id: '1'
  },
  {
    id: '2',
    name: 'Safra Milho 2024',
    planted_area_ha: 150.0,
    harvest_date: '2024-07-20',
    productivity_per_hectare: 8500,
    property_id: '2'
  }
];

export const mockDashboardStats = {
  totalFarmers: 3,
  totalProperties: 2,
  totalHectares: 450.5,
  totalCrops: 3,
  activeHarvests: 2,
  propertiesByState: [
    { state: 'SP', count: 1 },
    { state: 'MG', count: 1 }
  ],
  cropDistribution: [
    { name: 'Soja', area: 80 },
    { name: 'Milho', area: 150 }
  ],
  topCities: [
    { city: 'Ribeirão Preto', count: 1 },
    { city: 'Uberlândia', count: 1 }
  ],
  landUseDistribution: [
    { name: 'Área Cultivável', value: 370 },
    { name: 'Vegetação', value: 80.5 }
  ]
};

export const mockUser = {
  id: '1',
  producer_name: 'João Silva',
  email: 'joao@fazenda.com',
  role: 'farmer' as const
};

export const mockAdminUser = {
  id: '3',
  producer_name: 'Admin Sistema',
  email: 'admin@sistema.com',
  role: 'admin' as const
};
