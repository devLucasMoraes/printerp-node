import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useEquipamentoQueries } from "../../../hooks/queries/useEquipamentoQueries";
import {
  equipamentoCreateSchema,
  equipamentoUpdateSchema,
} from "../../../schemas/equipamento.schemas";
import { useAlertStore } from "../../../stores/useAlertStore";
import { EquipamentoDto } from "../../../types";

interface EquipamentoModalProps {
  open: boolean;
  onClose: () => void;
  equipamento?: EquipamentoDto;
}

export const EquipamentoModal = ({
  open,
  onClose,
  equipamento,
}: EquipamentoModalProps) => {
  const { showAlert } = useAlertStore((state) => state);

  const schema = equipamento
    ? equipamentoUpdateSchema
    : equipamentoCreateSchema;

  const { useCreate: useCreateEquipamento, useUpdate: useUpdateEquipamento } =
    useEquipamentoQueries();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EquipamentoDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
    },
  });

  useEffect(() => {
    if (equipamento) {
      reset({
        id: equipamento.id,
        nome: equipamento.nome,
      });
    } else {
      reset({
        nome: "",
      });
    }
  }, [equipamento, reset]);

  const { mutate: createEquipamento } = useCreateEquipamento();

  const { mutate: updateEquipamento } = useUpdateEquipamento();

  const onSubmit = (data: EquipamentoDto) => {
    if (equipamento) {
      updateEquipamento(
        { id: equipamento.id, data },
        {
          onSuccess: () => {
            onClose();
            reset();
            showAlert("Equipamento atualizado com sucesso", "success");
          },
          onError: (error) => {
            console.error(error);
            showAlert(error.response?.data.message || error.message, "error");
          },
        }
      );
    } else {
      createEquipamento(data, {
        onSuccess: () => {
          onClose();
          reset();
          showAlert("Equipamento criado com sucesso", "success");
        },
        onError: (error) => {
          console.error(error);
          showAlert(error.response?.data.message || error.message, "error");
        },
      });
    }
  };
  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <DialogTitle>{equipamento ? "Editar" : "Novo"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {equipamento
            ? "Preencha os campos abaixo para editar o equipamento"
            : "Preencha os campos abaixo para criar um novo equipamento"}
        </DialogContentText>
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={12}>
            <Controller
              name="nome"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome"
                  error={!!errors.nome}
                  helperText={errors.nome?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
