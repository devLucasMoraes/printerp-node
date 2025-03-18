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
import { useSetorQueries } from "../../../hooks/queries/useSetorQueries";
import {
  setorCreateSchema,
  setorUpdateSchema,
} from "../../../schemas/setor.schemas";
import { useAlertStore } from "../../../stores/useAlertStore";
import { SetorDto } from "../../../types";

interface SetorModalProps {
  open: boolean;
  onClose: () => void;
  setor?: {
    data: SetorDto;
    type: "UPDATE" | "COPY" | "CREATE" | "DELETE";
  };
}

export const SetorModal = ({ open, onClose, setor }: SetorModalProps) => {
  const { showAlert } = useAlertStore((state) => state);

  const schema =
    setor?.data && setor.type === "UPDATE"
      ? setorUpdateSchema
      : setorCreateSchema;

  const { useCreate: useCreateSetor, useUpdate: useUpdateSetor } =
    useSetorQueries();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SetorDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
    },
  });

  useEffect(() => {
    if (setor?.data && setor.type === "UPDATE") {
      reset({
        id: setor.data.id,
        nome: setor.data.nome,
      });
    } else if (setor?.data && setor.type === "COPY") {
      reset({
        id: null as any,
        nome: setor.data.nome,
      });
    } else {
      reset({
        id: null as any,
        nome: "",
      });
    }
  }, [setor, reset]);

  const { mutate: createSetor } = useCreateSetor();

  const { mutate: updateSetor } = useUpdateSetor();

  const onSubmit = (data: SetorDto) => {
    if (setor?.data && setor.type === "UPDATE") {
      updateSetor(
        { id: setor.data.id, data },
        {
          onSuccess: () => {
            onClose();
            reset();
            showAlert("Setor atualizado com sucesso", "success");
          },
          onError: (error) => {
            console.error(error);
            showAlert(error.response?.data.message || error.message, "error");
          },
        }
      );
    } else {
      createSetor(data, {
        onSuccess: () => {
          onClose();
          reset();
          showAlert("Setor criado com sucesso", "success");
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
      <DialogTitle>{setor?.type === "UPDATE" ? "Editar" : "Novo"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {setor?.type === "UPDATE"
            ? "Preencha os campos abaixo para editar o setor"
            : "Preencha os campos abaixo para criar um novo setor"}
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
