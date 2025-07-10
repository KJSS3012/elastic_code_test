import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../stores/store';
import { fetchAllProducers, fetchAdminDashboardStats } from '../../stores/producer/slice';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  People,
  Agriculture,
  TrendingUp,
  Assessment
} from '@mui/icons-material';

const AdminPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { producers, dashboardStats, loading, error } = useSelector((state: RootState) => state.producerReducer);

  useEffect(() => {
    // Buscar todos os produtores
    dispatch(fetchAllProducers({ page: 1, limit: 100 }));

    // Buscar estatísticas do dashboard
    dispatch(fetchAdminDashboardStats({}));
  }, [dispatch]);

  // Preparar dados para os gráficos
  const getTotalProducers = () => producers.length;
  const getTotalProperties = () => producers.reduce((total, producer) => total + (producer.farms?.length || 0), 0);
  const getTotalArea = () => producers.reduce((total, producer) =>
    total + (producer.farms?.reduce((farmTotal, farm) => farmTotal + (farm.total_area_ha || 0), 0) || 0), 0
  );

  // Dados para gráfico de barras - Área por estado
  const getAreaByState = () => {
    const stateArea: { [key: string]: number } = {};
    producers.forEach(producer => {
      producer.farms?.forEach(farm => {
        const state = farm.state || 'Não informado';
        stateArea[state] = (stateArea[state] || 0) + (farm.total_area_ha || 0);
      });
    });

    return Object.entries(stateArea).map(([state, area]) => ({
      state,
      area: Math.round(area)
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Área Administrativa
      </Typography>

      {/* Cards de Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total de Produtores
                  </Typography>
                  <Typography variant="h4">
                    {getTotalProducers()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Agriculture color="secondary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total de Propriedades
                  </Typography>
                  <Typography variant="h4">
                    {getTotalProperties()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Área Total (ha)
                  </Typography>
                  <Typography variant="h4">
                    {getTotalArea().toLocaleString('pt-BR')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assessment color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Safras Ativas
                  </Typography>
                  <Typography variant="h4">
                    {dashboardStats?.activeHarvests || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfico de Barras - Área por Estado */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Área Total por Estado (ha)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getAreaByState()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} ha`, 'Área']} />
                <Legend />
                <Bar dataKey="area" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabela de Produtores */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Lista de Produtores
        </Typography>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CPF/CNPJ</TableCell>
                <TableCell align="center">Propriedades</TableCell>
                <TableCell align="center">Área Total (ha)</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {producers.map((producer) => (
                <TableRow hover key={producer.id}>
                  <TableCell>{producer.producer_name}</TableCell>
                  <TableCell>{producer.cpf || producer.cnpj || 'Não informado'}</TableCell>
                  <TableCell align="center">{producer.farms?.length || 0}</TableCell>
                  <TableCell align="center">
                    {(producer.farms?.reduce((total, farm) => total + (farm.total_area_ha || 0), 0) || 0).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label="Ativo"
                      color="success"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AdminPage;
