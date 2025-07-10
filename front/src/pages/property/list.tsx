import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../stores/store';
import { fetchMyFarms, fetchAllProducers, deleteFarm } from '../../stores/producer/slice';
import { Container, Grid, Card, CardContent, Typography, CardActionArea, IconButton, Box, CircularProgress, Alert, Fab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Delete, Add } from '@mui/icons-material';
import type { AppDispatch } from '../../stores/store';
import { useNotification } from '../../contexts/NotificationContext';
import ConfirmationModal from '../../components/molecules/ConfirmationModal';

const PropertyList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.authReducer);
  const { myFarms, producers, loading } = useSelector((state: RootState) => state.producerReducer);
  const { showNotification } = useNotification();
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; farmId: string | null }>({
    open: false,
    farmId: null
  });

  useEffect(() => {
    if (user?.role === 'farmer') {
      dispatch(fetchMyFarms());
    } else if (user?.role === 'admin') {
      dispatch(fetchAllProducers({ page: 1, limit: 100 }));
    }
  }, [dispatch, user?.role]);

  const handleDeleteClick = (farmId: string) => {
    setDeleteModal({ open: true, farmId });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.farmId) {
      try {
        await dispatch(deleteFarm(deleteModal.farmId)).unwrap();
        showNotification('Propriedade excluída com sucesso!', 'success');
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao excluir propriedade';
        setError(errorMessage);
        showNotification(errorMessage, 'error');
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, farmId: null });
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

  // Preparar dados baseado no tipo de usuário
  type FarmWithProducer = {
    id: string;
    farm_name: string;
    city: string;
    state: string;
    total_area_ha: number;
    producerName: string;
    [key: string]: any;
  };

  let farms: FarmWithProducer[] = [];
  if (user?.role === 'farmer') {
    farms = myFarms.map(farm => ({
      ...farm,
      id: farm.id || '',
      farm_name: farm.farm_name || 'Nome não informado',
      city: farm.city || 'Cidade não informada',
      state: farm.state || 'Estado não informado',
      total_area_ha: farm.total_area_ha || 0,
      producerName: user.producer_name || 'Produtor não informado'
    }));
  } else if (user?.role === 'admin') {
    farms = producers.flatMap(producer =>
      producer.farms?.map(farm => ({
        ...farm,
        id: farm.id || '',
        farm_name: farm.farm_name || 'Nome não informado',
        city: farm.city || 'Cidade não informada',
        state: farm.state || 'Estado não informado',
        total_area_ha: farm.total_area_ha || 0,
        producerName: producer.producer_name || 'Produtor não informado'
      })) || []
    );
  }

  return (
    <Container maxWidth="lg">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
        {user?.role === 'admin' ? 'Todas as Propriedades' : 'Minhas Propriedades'}
      </Typography>

      {farms.length === 0 ? (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {user?.role === 'admin' ? 'Nenhuma propriedade cadastrada no sistema' : 'Você ainda não possui propriedades cadastradas'}
          </Typography>
          {user?.role === 'farmer' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Clique no botão + para cadastrar sua primeira propriedade
            </Typography>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {farms.map((farm) => (
            <Grid key={farm.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardActionArea onClick={() => navigate(`/properties/${farm.id}`)}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {farm.farm_name}
                    </Typography>
                    <Typography color="text.secondary">
                      {farm.city}, {farm.state}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Produtor: {farm.producerName}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1.5 }}>
                      Área Total: {farm.total_area_ha ? farm.total_area_ha.toLocaleString('pt-BR') : '0'} ha
                    </Typography>
                  </CardContent>
                </CardActionArea>
                {(user?.role === 'farmer' || user?.role === 'admin') && (
                  <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(farm.id);
                      }}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Botão flutuante para adicionar propriedade (apenas para farmers) */}
      {user?.role === 'farmer' && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => navigate('/properties/new')}
        >
          <Add />
        </Fab>
      )}

      {/* Modal de confirmação de exclusão */}
      <ConfirmationModal
        open={deleteModal.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta propriedade? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmColor="error"
      />
    </Container>
  );
};

export default PropertyList;