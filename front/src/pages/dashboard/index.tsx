import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { type RootState } from '../../stores/store';
import { fetchPersonalDashboardStats } from '../../stores/producer/slice';
import { Grid, Card, CardContent, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.authReducer);
  const { personalDashboardStats, loading, error } = useSelector((state: RootState) => state.producerReducer);

  // Buscar dados do dashboard quando o componente carrega
  useEffect(() => {
    dispatch(fetchPersonalDashboardStats({}) as any);
  }, [dispatch]);

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  // Extrair dados da API ou usar valores padrão
  const stats = personalDashboardStats || {};
  const personalStats = {
    totalFarms: stats.totalProperties || 0,
    totalArea: stats.totalHectares || 0,
    totalHarvests: stats.activeHarvests || 0,
    totalCrops: stats.totalCrops || 0
  };

  // Dados para gráficos vindos da API
  const farmAreaData = stats.myProperties || [];
  const landUseChartData = stats.myLandUse || [];
  const cropDistributionData = stats.myCrops || [];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Meu Dashboard - {user?.producer_name || user?.email || 'Usuário'}
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Este dashboard mostra seus dados pessoais. Para dados administrativos globais, acesse a "Área Admin".
      </Alert>

      {/* KPI Cards Pessoais */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Minhas Propriedades
              </Typography>
              <Typography variant="h4" component="div">
                {personalStats.totalFarms}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Área Total
              </Typography>
              <Typography variant="h4" component="div">
                {typeof personalStats.totalArea === 'number' ? personalStats.totalArea.toFixed(1) : '0.0'} ha
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Minhas Safras
              </Typography>
              <Typography variant="h4" component="div">
                {personalStats.totalHarvests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Culturas Diferentes
              </Typography>
              <Typography variant="h4" component="div">
                {personalStats.totalCrops}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Área por Propriedade */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Área por Propriedade</Typography>
              {farmAreaData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={farmAreaData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalArea" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma propriedade encontrada
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Uso da Terra */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Uso da Terra</Typography>
              {landUseChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={landUseChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {landUseChartData.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <Typography variant="body2" color="text.secondary">
                    Dados de uso da terra não disponíveis
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Distribuição de Culturas */}
        {cropDistributionData.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Distribuição de Culturas</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cropDistributionData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="area" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Próximos Passos
          </Typography>
          <Typography variant="body1" paragraph>
            • Cadastre suas propriedades em "Nova Propriedade"
          </Typography>
          <Typography variant="body1" paragraph>
            • Gerencie seus dados em "Propriedades"
          </Typography>
          <Typography variant="body1">
            • Para visão geral do sistema, acesse "Área Admin"
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;