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
import { useArmazemQueries } from "../../../hooks/queries/useArmazemQueries";

import {
  armazemCreateSchema,
  armazemUpdateSchema,
} from "../../../schemas/armazem.schema";
import { useAlertStore } from "../../../stores/useAlertStore";
import { ArmazemDto } from "../../../types";

interface ArmazemModalProps {
  open: boolean;
  onClose: () => void;
  armazem?: { data: ArmazemDto; type: "UPDATE" | "COPY" | "CREATE" | "DELETE" };
}

export const ArmazemModal = ({ open, onClose, armazem }: ArmazemModalProps) => {
  const { showAlert } = useAlertStore((state) => state);

  const schema =
    armazem?.data && armazem.type === "UPDATE"
      ? armazemUpdateSchema
      : armazemCreateSchema;

  const { useCreate: useCreateArmazem, useUpdate: useUpdateArmazem } =
    useArmazemQueries();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ArmazemDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
    },
  });

  useEffect(() => {
    if (armazem?.data && armazem.type === "UPDATE") {
      reset({
        id: armazem.data.id,
        nome: armazem.data.nome,
      });
    }
    if (armazem?.data && armazem.type === "COPY") {
      reset({
        id: null as any,
        nome: armazem.data.nome,
      });
    }
    if (!armazem?.data || armazem?.type == "CREATE") {
      reset({
        id: null as any,
        nome: "",
      });
    }
  }, [armazem, reset]);

  const { mutate: createArmazem } = useCreateArmazem();

  const { mutate: updateArmazem } = useUpdateArmazem();

  const onSubmit = (data: ArmazemDto) => {
    if (armazem?.data && armazem.type === "UPDATE") {
      updateArmazem(
        { id: armazem.data.id, data },
        {
          onSuccess: () => {
            onClose();
            reset();
            showAlert("Armazém atualizado com sucesso", "success");
          },
          onError: (error) => {
            console.error(error);
            showAlert(error.response?.data.message || error.message, "error");
          },
        }
      );
    } else {
      createArmazem(data, {
        onSuccess: () => {
          onClose();
          reset();
          showAlert("Armazém criado com sucesso", "success");
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
      <DialogTitle>
        {armazem?.type === "UPDATE" ? "Editar" : "Novo"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {armazem?.type === "UPDATE"
            ? "Preencha os campos abaixo para editar o armazém"
            : "Preencha os campos abaixo para criar um novo armazém"}
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
