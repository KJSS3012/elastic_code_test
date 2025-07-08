import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../stores/store';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const Dashboard: React.FC = () => {
  const producers = useSelector((state: RootState) => state.producerReducer.producers);

  // Cálculos e formatação de dados... (sem alterações aqui)
  const totalFarms = producers.reduce((sum, p) => sum + p.farms.length, 0);
  const totalHectares = producers.reduce(
    (sum, p) => sum + p.farms.reduce((fSum, f) => fSum + f.total_area_ha, 0),
    0
  );

  const farmsByState = producers.flatMap(p => p.farms).reduce((acc, farm) => {
    acc[farm.state] = (acc[farm.state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const stateChartData = Object.entries(farmsByState).map(([name, value]) => ({ name, value }));

  const cropsData = {}; // Dados de exemplo até que a propriedade crops seja definida no tipo Farm
  const cropChartData = [
    { name: 'Soja', value: 45 },
    { name: 'Milho', value: 30 },
    { name: 'Algodão', value: 15 },
    { name: 'Café', value: 10 }
  ]; // Dados de exemplo

  const landUseData = producers.flatMap(p => p.farms).reduce((acc, farm) => {
    acc.farmableArea += farm.arable_area_ha;
    acc.vegetationArea += farm.vegetation_area_ha;
    return acc;
  }, { farmableArea: 0, vegetationArea: 0 });
  const landUseChartData = [
    { name: 'Área Agricultável', value: landUseData.farmableArea },
    { name: 'Área de Vegetação', value: landUseData.vegetationArea },
  ];

  return (
    <Box>
      {/* Cards de KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total de Fazendas</Typography>
              <Typography variant="h4" component="div">{totalFarms}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total de Hectares</Typography>
              <Typography variant="h4" component="div">{totalHectares.toLocaleString('pt-BR')} ha</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Produtores Cadastrados</Typography>
              <Typography variant="h4" component="div">{producers.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Fazendas por Estado</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={stateChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                    {stateChartData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Culturas Plantadas</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={cropChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                    {cropChartData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Uso do Solo (ha)</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={landUseChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                    {landUseChartData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;