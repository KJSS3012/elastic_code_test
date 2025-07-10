import React, { useEffect, useState } from 'react';
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
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import {
  People,
  Agriculture,
  TrendingUp,
  Assessment
} from '@mui/icons-material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { producers, dashboardStats, loading, error } = useSelector((state: RootState) => state.producerReducer);
  const [yearFilter, setYearFilter] = useState<number>(new Date().getFullYear());
  const [stateFilter, setStateFilter] = useState<string>('');

  useEffect(() => {
    // Buscar todos os produtores
    dispatch(fetchAllProducers({ page: 1, limit: 100 }));

    // Buscar estatísticas do dashboard
    dispatch(fetchAdminDashboardStats({
      year: yearFilter,
      ...(stateFilter && { state: stateFilter })
    }));
  }, [dispatch, yearFilter, stateFilter]);

  const handleApplyFilters = () => {
    dispatch(fetchAdminDashboardStats({
      year: yearFilter,
      ...(stateFilter && { state: stateFilter })
    }));
  };

  // Preparar dados para os gráficos
  const getTotalProducers = () => producers.length;
  const getTotalProperties = () => producers.reduce((total, producer) => total + (producer.farms?.length || 0), 0);
  const getTotalArea = () => producers.reduce((total, producer) =>
    total + (producer.farms?.reduce((farmTotal, farm) => farmTotal + (farm.total_area_ha || 0), 0) || 0), 0
  );

  // Dados para gráfico de pizza - Distribuição por estado
  const getStateDistribution = () => {
    const stateCount: { [key: string]: number } = {};
    producers.forEach(producer => {
      producer.farms?.forEach(farm => {
        const state = farm.state || 'Não informado';
        stateCount[state] = (stateCount[state] || 0) + 1;
      });
    });

    return Object.entries(stateCount).map(([state, count]) => ({
      name: state,
      value: count
    }));
  };

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

  // Dados para gráfico de linha - Propriedades por mês (simulado)
  const getPropertiesTimeline = () => {
    // Simular dados mensais para o ano atual
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    return months.map((month, index) => ({
      month,
      properties: Math.floor(Math.random() * 10) + index * 2 + 5 // Dados simulados
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

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtros
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Ano</InputLabel>
              <Select
                value={yearFilter}
                onChange={(e) => setYearFilter(Number(e.target.value))}
                label="Ano"
              >
                {[2024, 2023, 2022, 2021, 2020].map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                label="Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="SP">São Paulo</MenuItem>
                <MenuItem value="MG">Minas Gerais</MenuItem>
                <MenuItem value="PR">Paraná</MenuItem>
                <MenuItem value="RS">Rio Grande do Sul</MenuItem>
                <MenuItem value="GO">Goiás</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              fullWidth
            >
              Aplicar Filtros
            </Button>
          </Grid>
        </Grid>
      </Paper>

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
        {/* Gráfico de Pizza - Distribuição por Estado */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Distribuição de Propriedades por Estado
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getStateDistribution()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getStateDistribution().map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfico de Barras - Área por Estado */}
        <Grid size={{ xs: 12, md: 6 }}>
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

        {/* Gráfico de Linha - Timeline de Propriedades */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Evolução de Propriedades Cadastradas ({yearFilter})
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getPropertiesTimeline()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="properties" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
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
