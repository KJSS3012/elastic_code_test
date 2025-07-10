import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid
} from '@mui/material';
import { type Farm } from '../../../stores/producer/slice';
import AccessibleDialog from '../../molecules/AccessibleDialog';

interface HarvestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: HarvestFormData) => void;
  property: Farm;
}

const harvestSchema = z.object({
  name: z.string().min(1, 'O nome da safra é obrigatório.'),
  total_area_ha: z.coerce.number().min(0.1, 'A área deve ser maior que zero.'),
});

export type HarvestFormData = z.infer<typeof harvestSchema>;

const HarvestModal: React.FC<HarvestModalProps> = ({ open, onClose, onSubmit, property }) => {
  const totalHarvestArea = (property.harvests || []).reduce((sum, h) => sum + h.total_area_ha, 0);
  const availableArea = property.arable_area_ha - totalHarvestArea;

  const refinedSchema = harvestSchema.refine(data => data.total_area_ha <= availableArea, {
    message: `A área não pode exceder o total disponível (${availableArea.toLocaleString('pt-BR')} ha)`,
    path: ['total_area_ha'],
  });

  const { control, handleSubmit, formState: { errors } } = useForm<HarvestFormData>({
    resolver: zodResolver(refinedSchema),
    defaultValues: { name: '', total_area_ha: 0 }
  });


  return (
    <AccessibleDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="harvest-modal-title"
      aria-describedby="harvest-modal-content"
    >
      <DialogTitle id="harvest-modal-title">Adicionar Nova Safra</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent id="harvest-modal-content">
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Nome da Safra (ex: Safra Verão 2025)" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="total_area_ha"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Área da Safra (ha)" type="number" fullWidth error={!!errors.total_area_ha} helperText={errors.total_area_ha?.message ?? `Área disponível: ${availableArea.toLocaleString('pt-BR')} ha`} />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Salvar Safra</Button>
        </DialogActions>
      </form>
    </AccessibleDialog>
  );
};

export default HarvestModal;