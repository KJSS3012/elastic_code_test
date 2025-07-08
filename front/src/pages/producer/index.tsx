import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../stores/store';
import { addProducer, updateProducer, removeProducer, type Producer } from '../../stores/producer/slice';
import {
  Container, Grid, Card, CardContent, Typography, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, FormControl,
  InputLabel, Select, MenuItem, IconButton, Box
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { validateCPF, validateCNPJ } from '../../utils/validation';

const producerSchema = z.object({
  producer_name: z.string().min(1, 'Nome é obrigatório'),
  document: z.string().min(1, 'Documento é obrigatório'),
  document_type: z.enum(['CPF', 'CNPJ']),
}).refine(data => {
  if (data.document_type === 'CPF') {
    return validateCPF(data.document);
  }
  return validateCNPJ(data.document);
}, {
  message: 'Documento inválido',
  path: ['document']
});

type ProducerFormData = z.infer<typeof producerSchema>;

const Producers: React.FC = () => {
  const dispatch = useDispatch();
  const producers = useSelector((state: RootState) => state.producerReducer.producers);
  const [open, setOpen] = useState(false);
  const [editingProducer, setEditingProducer] = useState<Producer | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProducerFormData>({
    resolver: zodResolver(producerSchema),
    defaultValues: {
      producer_name: '',
      document: '',
      document_type: 'CPF'
    }
  });

  const handleOpen = (producer?: Producer) => {
    if (producer) {
      setEditingProducer(producer);
      reset({
        producer_name: producer.producer_name,
        document: producer.document,
        document_type: producer.document_type
      });
    } else {
      setEditingProducer(null);
      reset();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProducer(null);
    reset();
  };

  const onSubmit = (data: ProducerFormData) => {
    if (editingProducer) {
      dispatch(updateProducer({
        ...editingProducer,
        ...data
      }));
    } else {
      dispatch(addProducer({
        id: Date.now().toString(),
        ...data,
        farms: []
      }));
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produtor?')) {
      dispatch(removeProducer(id));
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Produtores Rurais
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Adicionar Produtor
        </Button>
      </Box>

      <Grid container spacing={3}>
        {producers.map((producer) => (
          <Grid key={producer.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {producer.producer_name}
                </Typography>
                <Typography color="text.secondary">
                  {producer.document_type}: {producer.document}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Fazendas: {producer.farms.length}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleOpen(producer)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(producer.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProducer ? 'Editar Produtor' : 'Novo Produtor'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="producer_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nome do Produtor"
                      fullWidth
                      error={!!errors.producer_name}
                      helperText={errors.producer_name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="document_type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Documento</InputLabel>
                      <Select {...field} label="Tipo de Documento">
                        <MenuItem value="CPF">CPF</MenuItem>
                        <MenuItem value="CNPJ">CNPJ</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="document"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Documento"
                      fullWidth
                      error={!!errors.document}
                      helperText={errors.document?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingProducer ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Producers;
