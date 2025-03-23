import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { CategoriaAutoComplete } from "../../../components/shared/autocompletes/CategoriaAutoComplete";
import { unidades } from "../../../constants";
import { useInsumoQueries } from "../../../hooks/queries/useInsumoQueries";
import {
  insumoCreateSchema,
  insumoUpdateSchema,
} from "../../../schemas/insumo.schemas";
import { useAlertStore } from "../../../stores/useAlertStore";
import { InsumoDto } from "../../../types";

interface InsumoModalProps {
  open: boolean;
  onClose: () => void;
  insumo?: {
    data: InsumoDto;
    type: "UPDATE" | "COPY" | "CREATE" | "DELETE";
  };
}

export const InsumoModal = ({ open, onClose, insumo }: InsumoModalProps) => {
  const { showAlert } = useAlertStore((state) => state);

  const schema =
    insumo?.data && insumo.type === "UPDATE"
      ? insumoUpdateSchema
      : insumoCreateSchema;

  const { useCreate: useCreateInsumo, useUpdate: useUpdateInsumo } =
    useInsumoQueries();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InsumoDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      descricao: "",
      valorUntMedAuto: false,
      valorUntMed: null as any,
      undEstoque: null as any,
      estoqueMinimo: null as any,
      categoria: null as any,
    },
  });

  useEffect(() => {
    if (insumo?.data && insumo.type === "UPDATE") {
      reset({
        id: insumo.data.id,
        descricao: insumo.data.descricao,
        valorUntMedAuto: insumo.data.valorUntMedAuto,
        valorUntMed: insumo.data.valorUntMed,
        undEstoque: insumo.data.undEstoque,
        estoqueMinimo: insumo.data.estoqueMinimo,
        categoria: insumo.data.categoria,
      });
    } else if (insumo?.data && insumo.type === "COPY") {
      reset({
        id: null as any,
        descricao: insumo.data.descricao,
        valorUntMedAuto: insumo.data.valorUntMedAuto,
        valorUntMed: insumo.data.valorUntMed,
        undEstoque: insumo.data.undEstoque,
        estoqueMinimo: insumo.data.estoqueMinimo,
        categoria: insumo.data.categoria,
      });
    } else {
      reset({
        id: null as any,
        descricao: "",
        valorUntMedAuto: false,
        valorUntMed: null as any,
        undEstoque: null as any,
        estoqueMinimo: null as any,
        categoria: null as any,
      });
    }
  }, [insumo, reset]);

  const { mutate: createInsumo } = useCreateInsumo();

  const { mutate: updateInsumo } = useUpdateInsumo();

  const onSubmit = (data: InsumoDto) => {
    if (insumo?.data && insumo.type === "UPDATE") {
      updateInsumo(
        { id: insumo.data.id, data },
        {
          onSuccess: () => {
            onClose();
            reset();
            showAlert("Insumo atualizada com sucesso", "success");
          },
          onError: (error) => {
            console.error(error);
            showAlert(error.response?.data.message || error.message, "error");
          },
        }
      );
    } else {
      createInsumo(data, {
        onSuccess: () => {
          onClose();
          reset();
          showAlert("Insumo criada com sucesso", "success");
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
      <DialogTitle>{insumo?.type === "UPDATE" ? "Editar" : "Novo"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {insumo?.type === "UPDATE"
            ? "Preencha os campos abaixo para editar o insumo"
            : "Preencha os campos abaixo para criar um novo insumo"}
        </DialogContentText>
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={12}>
            <Controller
              name="descricao"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descrição"
                  error={!!errors.descricao}
                  helperText={errors.descricao?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>
          <Grid2 size={6}>
            <Controller
              name="valorUntMed"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Valor unitário"
                  error={!!errors.valorUntMed}
                  helperText={errors.valorUntMed?.message}
                  fullWidth
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? null : Number(value));
                  }}
                />
              )}
            />
          </Grid2>
          <Grid2 size={6}>
            <Controller
              name="valorUntMedAuto"
              control={control}
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormControl error={!!errors.valorUntMedAuto} fullWidth>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        {...fieldProps}
                      />
                    }
                    label="Valor unitário automático"
                  />
                  <FormHelperText>
                    {errors.valorUntMedAuto?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Grid2>
          <Grid2 size={6}>
            <Controller
              name="estoqueMinimo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Estoque mínimo"
                  error={!!errors.estoqueMinimo}
                  helperText={errors.estoqueMinimo?.message}
                  fullWidth
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? null : Number(value));
                  }}
                />
              )}
            />
          </Grid2>
          <Grid2 size={6}>
            <Controller
              name="undEstoque"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Und. Estoque"
                  error={!!errors.undEstoque}
                  helperText={errors.undEstoque?.message}
                  value={field.value || ""}
                  fullWidth
                  select
                >
                  {unidades.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid2>
          <Grid2 size={12}>
            <Controller
              name="categoria"
              control={control}
              render={({ field }) => (
                <CategoriaAutoComplete field={field} error={errors.categoria} />
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
