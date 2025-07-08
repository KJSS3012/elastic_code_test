import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { apiService } from '../services/api';

interface DashboardStats {
  totalFarms: number;
  totalHectares: number;
  farmsByState: { state: string; count: number }[];
  cropsByArea: { crop: string; area: number }[];
  soilUsage: { arable_area: number; vegetation_area: number };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await apiService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!stats) {
    return <div>Erro ao carregar dados do dashboard</div>;
  }

  const soilUsageData = [
    { name: 'Área Agricultável', value: stats.soilUsage.arable_area },
    { name: 'Área de Vegetação', value: stats.soilUsage.vegetation_area },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1>Dashboard</h1>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Total de Fazendas"
              value={stats.totalFarms}
              suffix="fazendas"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Total de Hectares"
              value={stats.totalHectares}
              suffix="hectares"
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16}>
        {/* Farms by State */}
        <Col span={8}>
          <Card title="Fazendas por Estado">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.farmsByState}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ state, count }) => `${state}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.farmsByState.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Crops by Area */}
        <Col span={8}>
          <Card title="Culturas por Área Plantada">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.cropsByArea}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ crop, area }) => `${crop}: ${area.toFixed(1)}ha`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="area"
                >
                  {stats.cropsByArea.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Soil Usage */}
        <Col span={8}>
          <Card title="Uso do Solo">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={soilUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value !== undefined ? value.toFixed(1) : '0.0'}ha`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {soilUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
