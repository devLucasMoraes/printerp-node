import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useEstoqueQueries } from "../../../hooks/queries/useEstoqueQueries";
import { adjustEstoqueSchema } from "../../../schemas/estoque.schema";
import { useAlertStore } from "../../../stores/useAlertStore";
import { EstoqueDto } from "../../../types";

interface EstoqueModalProps {
  open: boolean;
  onClose: () => void;
  estoque?: {
    data: EstoqueDto;
    type: "UPDATE" | "COPY" | "CREATE";
  };
}

export const EstoqueModal = ({ open, onClose, estoque }: EstoqueModalProps) => {
  const { showAlert } = useAlertStore((state) => state);

  const { useAdjustEstoque } = useEstoqueQueries();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EstoqueDto>({
    resolver: zodResolver(adjustEstoqueSchema),
    defaultValues: {
      id: null as any,
      armazem: null as any,
      insumo: null as any,
      quantidade: 0,
    },
  });

  useEffect(() => {
    if (!estoque?.data) {
      return;
    }
    reset({
      id: estoque.data.id,
      armazem: estoque.data.armazem,
      insumo: estoque.data.insumo,
      quantidade: estoque.data.quantidade,
    });
  }, [estoque, reset]);

  const { mutate: adjustEstoque } = useAdjustEstoque();

  const onSubmit = (data: EstoqueDto) => {
    if (estoque?.data && estoque.type === "UPDATE") {
      adjustEstoque(
        { id: estoque.data.id, data },
        {
          onSuccess: () => {
            onClose();
            reset();
            showAlert("Ajuste de estoque realizado com sucesso", "success");
          },
          onError: (error) => {
            console.error(error);
            showAlert(error.response?.data.message || error.message, "error");
          },
        }
      );
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
      <DialogTitle>Ajuste de estoque</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Informe a quantidade real do insumo: ${estoque?.data?.insumo?.descricao}, no armazém: ${estoque?.data?.armazem?.nome}`}
        </DialogContentText>
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={12}>
            <Controller
              name="quantidade"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Quantidade"
                  error={!!errors.quantidade}
                  helperText={errors.quantidade?.message}
                  fullWidth
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? null : Number(value));
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {estoque?.data && estoque.data.insumo.undEstoque}
                        </InputAdornment>
                      ),
                    },
                  }}
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
