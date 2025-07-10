import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid
} from '@mui/material';
import { type Harvest } from '../../../stores/producer/slice';
import AccessibleDialog from '../../molecules/AccessibleDialog';


interface CropModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CropFormData) => void;
  harvest: Harvest;
}

const cropSchema = z.object({
  name: z.string().min(1, 'O nome da cultura é obrigatório.'),
  planted_area_ha: z.coerce.number().min(0.1, 'A área deve ser maior que zero.'),
});

export type CropFormData = z.infer<typeof cropSchema>;

const CropModal: React.FC<CropModalProps> = ({ open, onClose, onSubmit, harvest }) => {

  const totalCropsArea = (harvest.crops || []).reduce((sum, c) => sum + c.planted_area_ha, 0);
  const availableArea = harvest.total_area_ha - totalCropsArea;

  const refinedSchema = cropSchema.refine(data => data.planted_area_ha <= availableArea, {
    message: `A área da cultura não pode exceder o disponível na safra (${availableArea.toLocaleString('pt-BR')} ha)`,
    path: ['planted_area_ha'],
  });

  const { control, handleSubmit, formState: { errors } } = useForm<CropFormData>({
    resolver: zodResolver(refinedSchema),
    defaultValues: { name: '', planted_area_ha: 0 }
  });

  return (
    <AccessibleDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="crop-modal-title"
      aria-describedby="crop-modal-content"
    >
      <DialogTitle id="crop-modal-title">Adicionar Cultura na Safra "{harvest.name}"</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent id="crop-modal-content">
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Nome da Cultura (ex: Soja, Milho)" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="planted_area_ha"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Área Plantada (ha)" type="number" fullWidth error={!!errors.planted_area_ha} helperText={errors.planted_area_ha?.message ?? `Área disponível na safra: ${availableArea.toLocaleString('pt-BR')} ha`} />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Salvar Cultura</Button>
        </DialogActions>
      </form>
    </AccessibleDialog>
  );
};

export default CropModal;