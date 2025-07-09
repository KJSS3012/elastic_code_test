import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../stores/store';
import { fetchAdminDashboardStats, fetchFarmerDashboardStats } from '../../stores/producer/slice';
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { DashboardFiltersComponent } from '../../components/molecules/DashboardFilters';
import type { DashboardFilters } from '../../types/dashboard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.authReducer);
  const { dashboardStats, loading } = useSelector((state: RootState) => state.producerReducer);
  const [filters, setFilters] = useState<DashboardFilters>({});

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchAdminDashboardStats(filters));
    } else {
      dispatch(fetchFarmerDashboardStats(filters));
    }
  }, [dispatch, user?.role, filters]);

  const handleFiltersChange = (newFilters: DashboardFilters) => {
    setFilters(newFilters);
  };

  if (loading || !dashboardStats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isAdmin ? 'Dashboard Administrativo' : `Bem-vindo, ${user?.producer_name || user?.email || 'Usuário'}`}
      </Typography>

      {/* Filtros do Dashboard */}
      <DashboardFiltersComponent
        currentFilters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {isAdmin ? 'Total de Produtores' : 'Minhas Propriedades'}
              </Typography>
              <Typography variant="h4" component="div">
                {isAdmin ? dashboardStats.totalFarmers : dashboardStats.totalProperties}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {isAdmin ? 'Total de Propriedades' : 'Total de Hectares'}
              </Typography>
              <Typography variant="h4" component="div">
                {isAdmin ? dashboardStats.totalProperties : `${dashboardStats.totalHectares} ha`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {isAdmin ? 'Total de Hectares' : 'Safras Ativas'}
              </Typography>
              <Typography variant="h4" component="div">
                {isAdmin ? `${dashboardStats.totalHectares} ha` : dashboardStats.activeHarvests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {isAdmin ? 'Total de Culturas' : 'Culturas Plantadas'}
              </Typography>
              <Typography variant="h4" component="div">
                {dashboardStats.totalCrops}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {isAdmin ? (
          <>
            {/* Admin Charts */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Propriedades por Estado</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardStats.propertiesByState}>
                      <XAxis dataKey="state" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Top 10 Cidades</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardStats.topCities}>
                      <XAxis dataKey="city" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Culturas Mais Plantadas</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={dashboardStats.cropDistribution} dataKey="area" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                        {dashboardStats.cropDistribution.map((_: any, index: number) => (
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
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Uso do Solo (Geral)</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={dashboardStats.landUseDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                        {dashboardStats.landUseDistribution.map((_: any, index: number) => (
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
          </>
        ) : (
          <>
            {/* Farmer Charts */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Minhas Propriedades</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardStats.myProperties}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="totalArea" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Distribuição de Culturas</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={dashboardStats.myCrops} dataKey="area" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                        {dashboardStats.myCrops.map((_: any, index: number) => (
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
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Uso do Solo nas Minhas Propriedades</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={dashboardStats.myLandUse} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                        {dashboardStats.myLandUse.map((_: any, index: number) => (
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
          </>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;