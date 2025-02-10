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
import { useCategoriaQueries } from "../../../hooks/queries/useCategoriaQueries";
import {
  categoriaCreateSchema,
  categoriaUpdateSchema,
} from "../../../schemas/categoria.schemas";
import { useAlertStore } from "../../../stores/useAlertStore";
import { CategoriaDto } from "../../../types";

interface CategoriaModalProps {
  open: boolean;
  onClose: () => void;
  categoria?: CategoriaDto;
}

export const CategoriaModal = ({
  open,
  onClose,
  categoria,
}: CategoriaModalProps) => {
  const { showAlert } = useAlertStore((state) => state);

  const schema = categoria ? categoriaUpdateSchema : categoriaCreateSchema;

  const { useCreate: useCreateCategoria, useUpdate: useUpdateCategoria } =
    useCategoriaQueries();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoriaDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
    },
  });

  useEffect(() => {
    if (categoria) {
      reset({
        id: categoria.id,
        nome: categoria.nome,
      });
    } else {
      reset({
        nome: "",
      });
    }
  }, [categoria, reset]);

  const { mutate: createCategoria } = useCreateCategoria();

  const { mutate: updateCategoria } = useUpdateCategoria();

  const onSubmit = (data: CategoriaDto) => {
    if (categoria) {
      updateCategoria(
        { id: categoria.id, data },
        {
          onSuccess: () => {
            onClose();
            reset();
            showAlert("Categoria atualizada com sucesso", "success");
          },
          onError: (error) => {
            console.error(error);
            showAlert(error.response?.data.message || error.message, "error");
          },
        }
      );
    } else {
      createCategoria(data, {
        onSuccess: () => {
          onClose();
          reset();
          showAlert("Categoria criada com sucesso", "success");
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
      <DialogTitle>{categoria ? "Editar" : "Nova"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {categoria
            ? "Preencha os campos abaixo para editar a categoria"
            : "Preencha os campos abaixo para criar uma nova categoria"}
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
