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
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRequisicaoEstoqueQueries } from "../../../hooks/queries/useRequisicaoEstoqueQueries";
import {
  requisicaoEstoqueCreateSchema,
  requisicaoEstoqueUpdateSchema,
} from "../../../schemas/requisicaoEstoque.schemas";
import { useAlertStore } from "../../../stores/useAlertStore";
import { RequisicaoEstoqueDto } from "../../../types";
import { EquipamentoAutoComplete } from "./EquipamentoAutoComplete";
import { RequisitanteAutoComplete } from "./RequisitanteAutoComplete";

interface RequisicaoEstoqueModalProps {
  open: boolean;
  onClose: () => void;
  requisicaoEstoque?: RequisicaoEstoqueDto;
}

export const RequisicaoEstoqueModal = ({
  open,
  onClose,
  requisicaoEstoque,
}: RequisicaoEstoqueModalProps) => {
  const { showAlert } = useAlertStore((state) => state);

  const schema = requisicaoEstoque
    ? requisicaoEstoqueUpdateSchema
    : requisicaoEstoqueCreateSchema;

  const {
    useCreate: useCreateRequisicaoEstoque,
    useUpdate: useUpdateRequisicaoEstoque,
  } = useRequisicaoEstoqueQueries();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RequisicaoEstoqueDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: null as any,
      dataRequisicao: null as any,
      ordemProducao: "",
      obs: "",
      equipamento: null as any,
      requisitante: null as any,
      valorTotal: 0,
      itens: [],
    },
  });

  useEffect(() => {
    if (requisicaoEstoque) {
      reset({
        id: requisicaoEstoque.id,
        dataRequisicao: new Date(requisicaoEstoque.dataRequisicao),
        ordemProducao: requisicaoEstoque.ordemProducao,
        obs: requisicaoEstoque.obs,
        equipamento: requisicaoEstoque.equipamento,
        requisitante: requisicaoEstoque.requisitante,
        valorTotal: Number(requisicaoEstoque.valorTotal),
        itens: requisicaoEstoque.itens,
      });
    } else {
      reset({
        id: null as any,
        dataRequisicao: null as any,
        ordemProducao: "",
        obs: "",
        equipamento: null as any,
        requisitante: null as any,
        valorTotal: 0,
        itens: [],
      });
    }
  }, [requisicaoEstoque, reset]);

  const { mutate: createRequisicaoEstoque } = useCreateRequisicaoEstoque();

  const { mutate: updateRequisicaoEstoque } = useUpdateRequisicaoEstoque();

  const onSubmit = (data: RequisicaoEstoqueDto) => {
    if (requisicaoEstoque) {
      updateRequisicaoEstoque(
        { id: requisicaoEstoque.id, data },
        {
          onSuccess: () => {
            onClose();
            reset();
            showAlert("Requisicao atualizada com sucesso", "success");
          },
          onError: (error) => {
            console.error(error);
            showAlert(error.response?.data.message || error.message, "error");
          },
        }
      );
    } else {
      createRequisicaoEstoque(data, {
        onSuccess: () => {
          onClose();
          reset();
          showAlert("Requisicao criada com sucesso", "success");
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
      <DialogTitle>{requisicaoEstoque ? "Editar" : "Nova"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {requisicaoEstoque
            ? "Preencha os campos abaixo para editar a requisicao de estoque"
            : "Preencha os campos abaixo para criar uma nova requisicao de estoque"}
        </DialogContentText>
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={12}>
            <Controller
              name="dataRequisicao"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Data da requisição"
                  slotProps={{
                    textField: {
                      error: !!errors.dataRequisicao,
                      helperText: errors.dataRequisicao?.message,
                    },
                  }}
                />
              )}
            />
          </Grid2>
          <Grid2 size={12}>
            <Controller
              name="ordemProducao"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ordem de produção"
                  error={!!errors.ordemProducao}
                  helperText={errors.ordemProducao?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>
          <Grid2 size={12}>
            <Controller
              name="obs"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Observação"
                  error={!!errors.obs}
                  helperText={errors.obs?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>
          <Grid2 size={6}>
            <Controller
              name="valorTotal"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Valor total"
                  error={!!errors.valorTotal}
                  helperText={errors.valorTotal?.message}
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
          <Grid2 size={12}>
            <Controller
              name="equipamento"
              control={control}
              render={({ field }) => (
                <EquipamentoAutoComplete
                  field={field}
                  error={errors.equipamento}
                />
              )}
            />
          </Grid2>
          <Grid2 size={12}>
            <Controller
              name="requisitante"
              control={control}
              render={({ field }) => (
                <RequisitanteAutoComplete
                  field={field}
                  error={errors.requisitante}
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
