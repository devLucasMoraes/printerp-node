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
  Typography,
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
  categoria?: {
    data: CategoriaDto;
    type: "UPDATE" | "COPY" | "CREATE" | "DELETE";
  };
}

export const CategoriaModal = ({
  open,
  onClose,
  categoria,
}: CategoriaModalProps) => {
  const { showAlert } = useAlertStore((state) => state);

  const schema =
    categoria?.data && categoria.type === "UPDATE"
      ? categoriaUpdateSchema
      : categoriaCreateSchema;

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
    console.log(categoria);
    if (categoria?.data && categoria.type === "UPDATE") {
      reset({
        id: categoria.data.id,
        nome: categoria.data.nome,
      });
    } else if (categoria?.data && categoria.type === "COPY") {
      reset({
        id: null as any,
        nome: categoria.data.nome,
      });
    } else {
      reset({
        id: null as any,
        nome: "",
      });
    }
  }, [categoria, reset]);

  const { mutate: createCategoria } = useCreateCategoria();

  const { mutate: updateCategoria } = useUpdateCategoria();

  const onSubmit = (data: CategoriaDto) => {
    if (categoria?.data && categoria.type === "UPDATE") {
      updateCategoria(
        { id: categoria.data.id, data },
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
      <DialogTitle>
        <Typography>
          {categoria?.type === "UPDATE" ? "Editar" : "Nova"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {categoria?.type === "UPDATE"
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
