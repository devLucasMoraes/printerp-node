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
import { useParceiroQueries } from "../../../hooks/queries/useParceiroQueries";
import {
  parceiroCreateSchema,
  parceiroUpdateSchema,
} from "../../../schemas/parceiro.schemas";
import { useAlertStore } from "../../../stores/useAlertStore";
import { ParceiroDto } from "../../../types";

interface ParceiroModalProps {
  open: boolean;
  onClose: () => void;
  parceiro?: {
    data: ParceiroDto;
    type: "UPDATE" | "COPY" | "CREATE" | "DELETE";
  };
}

export const ParceiroModal = ({
  open,
  onClose,
  parceiro,
}: ParceiroModalProps) => {
  const { showAlert } = useAlertStore((state) => state);

  const schema =
    parceiro?.data && parceiro.type === "UPDATE"
      ? parceiroUpdateSchema
      : parceiroCreateSchema;

  const { useCreate: useCreateParceiro, useUpdate: useUpdateParceiro } =
    useParceiroQueries();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ParceiroDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
    },
  });

  useEffect(() => {
    if (parceiro?.data && parceiro.type === "UPDATE") {
      reset({
        id: parceiro.data.id,
        nome: parceiro.data.nome,
        fone: parceiro.data.fone,
      });
    } else if (parceiro?.data && parceiro.type === "COPY") {
      reset({
        id: null as any,
        nome: parceiro.data.nome,
        fone: parceiro.data.fone,
      });
    } else {
      reset({
        id: null as any,
        nome: "",
        fone: "",
      });
    }
  }, [parceiro, reset]);

  const { mutate: createParceiro } = useCreateParceiro();

  const { mutate: updateParceiro } = useUpdateParceiro();

  const onSubmit = (data: ParceiroDto) => {
    if (parceiro?.data && parceiro.type === "UPDATE") {
      updateParceiro(
        { id: parceiro.data.id, data },
        {
          onSuccess: () => {
            onClose();
            reset();
            showAlert("Parceiro atualizado com sucesso", "success");
          },
          onError: (error) => {
            console.error(error);
            showAlert(error.response?.data.message || error.message, "error");
          },
        }
      );
    } else {
      createParceiro(data, {
        onSuccess: () => {
          onClose();
          reset();
          showAlert("Parceiro criado com sucesso", "success");
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
        {parceiro?.type === "UPDATE" ? "Editar" : "Novo"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {parceiro?.type === "UPDATE"
            ? "Preencha os campos abaixo para editar o parceiro"
            : "Preencha os campos abaixo para criar um novo parceiro"}
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
          <Grid2 size={12}>
            <Controller
              name="fone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Telefone"
                  error={!!errors.fone}
                  helperText={errors.fone?.message}
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
