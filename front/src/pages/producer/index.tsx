import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../stores/store';
import { fetchAllProducers } from '../../stores/producer/slice';
import { apiService } from '../../services/api';
import {
  Container, Grid, Card, CardContent, Typography, Button,
  DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Box, CircularProgress, Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { validateCPF, validateCNPJ } from '../../utils/validation';
import { useNotification } from '../../contexts/NotificationContext';
import ConfirmationModal from '../../components/molecules/ConfirmationModal';
import AccessibleDialog from '../../components/molecules/AccessibleDialog';

const producerSchema = z.object({
  producer_name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
}).refine(data => {
  // Pelo menos um CPF ou CNPJ deve ser fornecido
  if (!data.cpf && !data.cnpj) {
    return false;
  }
  // Validar CPF se fornecido
  if (data.cpf && data.cpf.length > 0 && !validateCPF(data.cpf)) {
    return false;
  }
  // Validar CNPJ se fornecido
  if (data.cnpj && data.cnpj.length > 0 && !validateCNPJ(data.cnpj)) {
    return false;
  }
  return true;
}, {
  message: 'Forneça um CPF ou CNPJ válido',
  path: ['cpf']
});

type ProducerFormData = z.infer<typeof producerSchema>;

const Producers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { producers, loading } = useSelector((state: RootState) => state.producerReducer);
  const { showNotification } = useNotification();

  const [open, setOpen] = useState(false);
  const [editingProducer, setEditingProducer] = useState<any | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; producerId: string | null }>({
    open: false,
    producerId: null
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProducerFormData>({
    resolver: zodResolver(producerSchema),
    defaultValues: {
      producer_name: '',
      email: '',
      phone: '',
      cpf: '',
      cnpj: '',
      password: ''
    }
  });

  useEffect(() => {
    // Qualquer usuário pode acessar para demonstração
    dispatch(fetchAllProducers({ page: 1, limit: 100 }));
  }, [dispatch]);

  const handleOpen = (producer?: any) => {
    setError(null);
    if (producer) {
      setEditingProducer(producer);
      reset({
        producer_name: producer.producer_name,
        email: producer.email,
        phone: producer.phone,
        cpf: producer.cpf || '',
        cnpj: producer.cnpj || '',
        password: '' // Não preencher senha ao editar
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
    setError(null);
    reset();
  };

  const onSubmit = async (data: ProducerFormData) => {
    setFormLoading(true);
    setError(null);

    try {
      if (editingProducer) {
        // Atualizar produtor existente
        const updateData = { ...data };
        if (!updateData.password) {
          delete updateData.password; // Não enviar senha vazia
        }
        await apiService.updateFarmer(editingProducer.id, updateData);
        showNotification('Produtor atualizado com sucesso!', 'success');
      } else {
        // Criar novo produtor
        if (!data.password) {
          throw new Error('Senha é obrigatória para novos produtores');
        }
        await apiService.createFarmer(data);
        showNotification('Produtor criado com sucesso!', 'success');
      }

      // Recarregar lista de produtores
      dispatch(fetchAllProducers({ page: 1, limit: 100 }));
      handleClose();
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao salvar produtor';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (producerId: string) => {
    setDeleteModal({ open: true, producerId });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.producerId) {
      try {
        await apiService.deleteFarmer(deleteModal.producerId);
        showNotification('Produtor excluído com sucesso!', 'success');
        dispatch(fetchAllProducers({ page: 1, limit: 100 }));
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao excluir produtor';
        setError(errorMessage);
        showNotification(errorMessage, 'error');
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, producerId: null });
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

  return (
    <Container maxWidth="lg">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

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
                <Typography color="text.secondary" variant="body2">
                  {producer.email}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {producer.cpf ? `CPF: ${producer.cpf}` :
                    producer.cnpj ? `CNPJ: ${producer.cnpj}` :
                      'CPF/CNPJ: Não informado'}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {producer.phone}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleOpen(producer)}
                    color="primary"
                    data-testid="edit-producer"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(producer.id)}
                    color="error"
                    data-testid="delete-producer"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <AccessibleDialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingProducer ? 'Editar Produtor' : 'Novo Produtor'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
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
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      type="email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Telefone"
                      fullWidth
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="cpf"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="CPF *"
                      fullWidth
                      required
                      error={!!errors.cpf}
                      helperText={errors.cpf?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="cnpj"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="CNPJ (Opcional)"
                      fullWidth
                      error={!!errors.cnpj}
                      helperText={errors.cnpj?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={editingProducer ? "Nova Senha (deixe vazio para manter)" : "Senha"}
                      type="password"
                      fullWidth
                      required={!editingProducer}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={formLoading}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={formLoading}>
              {formLoading ? <CircularProgress size={20} /> : (editingProducer ? 'Atualizar' : 'Criar')}
            </Button>
          </DialogActions>
        </form>
      </AccessibleDialog>

      {/* Modal de confirmação de exclusão */}
      <ConfirmationModal
        open={deleteModal.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este produtor? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmColor="error"
      />
    </Container>
  );
};

export default Producers;
