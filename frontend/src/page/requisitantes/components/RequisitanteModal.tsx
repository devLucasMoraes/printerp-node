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
import { useRequisitanteQueries } from "../../../hooks/queries/useRequisitanteQueries";
import {
  requisitanteCreateSchema,
  requisitanteUpdateSchema,
} from "../../../schemas/requisitante.schemas";
import { useAlertStore } from "../../../stores/useAlertStore";
import { RequisitanteDto } from "../../../types";

interface RequisitanteModalProps {
  open: boolean;
  onClose: () => void;
  requisitante?: {
    data: RequisitanteDto;
    type: "UPDATE" | "COPY" | "CREATE" | "DELETE";
  };
}

export const RequisitanteModal = ({
  open,
  onClose,
  requisitante,
}: RequisitanteModalProps) => {
  const { showAlert } = useAlertStore((state) => state);

  const schema =
    requisitante?.data && requisitante.type === "UPDATE"
      ? requisitanteUpdateSchema
      : requisitanteCreateSchema;

  const { useCreate: useCreateRequisitante, useUpdate: useUpdateRequisitante } =
    useRequisitanteQueries();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RequisitanteDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
    },
  });

  useEffect(() => {
    console.log(requisitante);
    if (requisitante?.data && requisitante.type === "UPDATE") {
      reset({
        id: requisitante.data.id,
        nome: requisitante.data.nome,
        fone: requisitante.data.fone,
      });
    } else if (requisitante?.data && requisitante.type === "COPY") {
      reset({
        id: null as any,
        nome: requisitante.data.nome,
        fone: requisitante.data.fone,
      });
    } else {
      reset({
        id: null as any,
        nome: "",
        fone: "",
      });
    }
  }, [requisitante, reset]);

  const { mutate: createRequisitante } = useCreateRequisitante();

  const { mutate: updateRequisitante } = useUpdateRequisitante();

  const onSubmit = (data: RequisitanteDto) => {
    console.log(data);
    if (requisitante?.data && requisitante.type === "UPDATE") {
      updateRequisitante(
        { id: requisitante.data.id, data },
        {
          onSuccess: () => {
            onClose();
            reset();
            showAlert("Requisitante atualizado com sucesso", "success");
          },
          onError: (error) => {
            console.error(error);
            showAlert(error.response?.data.message || error.message, "error");
          },
        }
      );
    } else {
      createRequisitante(data, {
        onSuccess: () => {
          onClose();
          reset();
          showAlert("Requisitante criado com sucesso", "success");
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
        {requisitante?.type === "UPDATE" ? "Editar" : "Novo"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {requisitante?.type === "UPDATE"
            ? "Preencha os campos abaixo para editar o requisitante"
            : "Preencha os campos abaixo para criar um novo requisitante"}
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
