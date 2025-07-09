import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../stores/store';
import {
  Container, Box, Typography, Paper, Grid, Accordion, AccordionSummary,
  AccordionDetails, Button, IconButton, Table, TableBody, TableCell,
  TableHead, TableRow, LinearProgress, Chip, CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { addHarvestToProperty, deleteHarvest, addCropToHarvest, deleteCrop, fetchMyFarms, fetchAllProducers, type Harvest } from '../../stores/producer/slice';
import HarvestModal, { type HarvestFormData } from '../../components/organisms/modal/harvestModal';
import CropModal, { type CropFormData } from '../../components/organisms/modal/cropModal';


const PropertyDetail: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.authReducer);
  const { loading } = useSelector((state: RootState) => state.producerReducer);

  const [isHarvestModalOpen, setHarvestModalOpen] = useState(false);
  const [isCropModalOpen, setCropModalOpen] = useState(false);
  const [selectedHarvest, setSelectedHarvest] = useState<Harvest | null>(null);

  // Carregar dados quando o componente é montado
  useEffect(() => {
    if (user?.role === 'farmer') {
      dispatch(fetchMyFarms());
    } else if (user?.role === 'admin') {
      dispatch(fetchAllProducers({ page: 1, limit: 100 }));
    }
  }, [dispatch, user?.role]);

  // Buscar propriedade baseado no tipo de usuário
  const farm = useSelector((state: RootState) => {
    if (user?.role === 'farmer') {
      // Para farmers, buscar em myFarms
      return state.producerReducer.myFarms.find(f => f.id === propertyId);
    } else {
      // Para admins, buscar em todas as propriedades dos produtores
      return state.producerReducer.producers.flatMap(p => p.farms).find(f => f.id === propertyId);
    }
  });

  // Mostrar loading enquanto os dados estão sendo carregados
  if (loading && !farm) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, mt: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Carregando propriedade...
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (!farm) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h6" color="error">
            Propriedade não encontrada.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            ID da propriedade: {propertyId}
          </Typography>
          <Typography variant="body2">
            Tipo de usuário: {user?.role}
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Garantir que harvests seja um array, mesmo que não exista
  const harvests = farm.harvests || [];
  const totalHarvestArea = harvests.reduce((sum, h) => sum + h.total_area_ha, 0);
  const usedAreaPercentage = farm.arable_area_ha > 0 ? (totalHarvestArea / farm.arable_area_ha) * 100 : 0;

  const handleOpenCropModal = (harvest: Harvest) => {
    setSelectedHarvest(harvest);
    setCropModalOpen(true);
  };

  const handleHarvestSubmit = (data: HarvestFormData) => {
    dispatch(addHarvestToProperty({ propertyId: farm.id, harvest: data }));
    setHarvestModalOpen(false);
  };

  const handleCropSubmit = (data: CropFormData) => {
    if (selectedHarvest) {
      dispatch(addCropToHarvest({ propertyId: farm.id, harvestId: selectedHarvest.id, crop: data }));
    }
    setCropModalOpen(false);
    setSelectedHarvest(null);
  }

  return (
    <Container maxWidth="lg">
      {/* Modais */}
      <HarvestModal
        open={isHarvestModalOpen}
        onClose={() => setHarvestModalOpen(false)}
        onSubmit={handleHarvestSubmit}
        property={farm}
      />
      {selectedHarvest && (
        <CropModal
          open={isCropModalOpen}
          onClose={() => setCropModalOpen(false)}
          onSubmit={handleCropSubmit}
          harvest={selectedHarvest}
        />
      )}

      {/* Conteúdo da Página */}
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>{farm.farm_name}</Typography>
        <Typography variant="subtitle1" color="text.secondary">{farm.city}, {farm.state}</Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 4 }}><Chip label={`Área Total: ${farm.total_area_ha} ha`} sx={{ width: '100%' }} /></Grid>
          <Grid size={{ xs: 4 }}><Chip label={`Área Agricultável: ${farm.arable_area_ha} ha`} color="success" sx={{ width: '100%' }} /></Grid>
          <Grid size={{ xs: 4 }}><Chip label={`Área de Vegetação: ${farm.vegetable_area_ha} ha`} color="warning" sx={{ width: '100%' }} /></Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography>
            Uso da Área Agricultável: {totalHarvestArea.toLocaleString('pt-BR')} ha / {farm.arable_area_ha.toLocaleString('pt-BR')} ha
          </Typography>
          <LinearProgress variant="determinate" value={usedAreaPercentage} sx={{ height: 10, borderRadius: 5 }} />
        </Box>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Safras</Typography>
          <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => setHarvestModalOpen(true)}>
            Adicionar Safra
          </Button>
        </Box>

        {harvests.map(harvest => (
          <Accordion key={harvest.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ flexGrow: 1 }}>{harvest.name}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>Área: {harvest.total_area_ha} ha</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">Culturas Plantadas</Typography>
                <div>
                  <Button size="small" onClick={() => handleOpenCropModal(harvest)}>Adicionar Cultura</Button>
                  <IconButton size="small" onClick={() => dispatch(deleteHarvest({ propertyId: farm.id, harvestId: harvest.id }))}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Cultura</TableCell>
                    <TableCell>Área Plantada (ha)</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(harvest.crops || []).map(crop => (
                    <TableRow key={crop.id}>
                      <TableCell>{crop.name}</TableCell>
                      <TableCell>{crop.planted_area_ha}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => dispatch(deleteCrop({ propertyId: farm.id, harvestId: harvest.id, cropId: crop.id }))}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default PropertyDetail;