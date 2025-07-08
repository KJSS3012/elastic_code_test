import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../stores/store';
import { removeFarm } from '../../stores/producer/slice';
import { Container, Grid, Card, CardContent, Typography, CardActionArea, IconButton, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Delete } from '@mui/icons-material';

const PropertyList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const producers = useSelector((state: RootState) => state.producerReducer.producers);

  const allFarms = producers.flatMap(p =>
    p.farms.map(farm => ({
      ...farm,
      producerId: p.id,
      producerName: p.producer_name
    }))
  );

  const handleDelete = (producerId: string, farmId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta propriedade?')) {
      dispatch(removeFarm({ producerId, farmId }));
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
        Minhas Propriedades
      </Typography>
      <Grid container spacing={3}>
        {allFarms.map((farm) => (
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
                    Área Total: {farm.total_area_ha.toLocaleString('pt-BR')} ha
                  </Typography>
                </CardContent>
              </CardActionArea>
              <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(farm.producerId, farm.id);
                  }}
                  color="error"
                  size="small"
                >
                  <Delete />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PropertyList;