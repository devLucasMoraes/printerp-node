import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid2,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { IconCircleMinus, IconPlus } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { ArmazemAutoComplete } from "../../../components/shared/autocompletes/ArmazemAutoComplete";
import { InsumoAutoComplete } from "../../../components/shared/autocompletes/InsumoAutoComplete";
import { RequisitanteAutoComplete } from "../../../components/shared/autocompletes/RequisitanteAutoComplete";
import { SetorAutoComplete } from "../../../components/shared/autocompletes/SetorAutoComplete";
import { unidades } from "../../../constants";
import { useRequisicaoEstoqueQueries } from "../../../hooks/queries/useRequisicaoEstoqueQueries";
import {
  requisicaoEstoqueCreateSchema,
  requisicaoEstoqueUpdateSchema,
} from "../../../schemas/requisicaoEstoque.schemas";
import { useAlertStore } from "../../../stores/useAlertStore";
import { InsumoDto, RequisicaoEstoqueDto } from "../../../types";

const defaultValues = {
  id: null as any,
  dataRequisicao: null as any,
  ordemProducao: "",
  obs: "",
  setor: null as any,
  requisitante: null as any,
  armazem: null as any,
  valorTotal: 0,
  itens: [],
};

export const RequisicaoEstoqueModal = ({
  open,
  onClose,
  requisicaoEstoque,
}: {
  open: boolean;
  onClose: () => void;
  requisicaoEstoque?: {
    data?: RequisicaoEstoqueDto;
    type: "UPDATE" | "COPY" | "CREATE" | "DELETE";
  };
}) => {
  const { showAlert } = useAlertStore((state) => state);

  const queryClient = useQueryClient();

  const { useCreate, useUpdate } = useRequisicaoEstoqueQueries();

  const isUpdate = requisicaoEstoque?.type === "UPDATE";

  const schema = isUpdate
    ? requisicaoEstoqueUpdateSchema
    : requisicaoEstoqueCreateSchema;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<RequisicaoEstoqueDto>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: "itens",
  });

  const items = useWatch({
    control,
    name: "itens",
    defaultValue: [],
  });

  useEffect(() => {
    const total =
      items?.reduce((total, item) => {
        const quantidade = Number(item.quantidade) || 0;
        const valorUnitario = Number(item.valorUnitario) || 0;
        return total + quantidade * valorUnitario;
      }, 0) || 0;

    setValue("valorTotal", Number(total.toFixed(2)));
  }, [items, setValue]);

  useEffect(() => {
    if (!requisicaoEstoque?.data) {
      reset(defaultValues);
      return;
    }

    const { data, type } = requisicaoEstoque;

    const formData: RequisicaoEstoqueDto = {
      ...data,
      id: type === "COPY" ? null : (data.id as any),
      dataRequisicao: new Date(data.dataRequisicao),
      valorTotal: Number(data.valorTotal),
      itens: data.itens.map((item) => ({
        id: type === "COPY" ? null : (item.id as any),
        insumo: item.insumo,
        quantidade: Number(item.quantidade),
        valorUnitario: Number(item.valorUnitario),
        unidade: item.unidade,
      })),
    };

    reset(formData);
  }, [requisicaoEstoque, reset]);

  const { mutate: createRequisicaoEstoque } = useCreate();
  const { mutate: updateRequisicaoEstoque } = useUpdate();

  const handleSuccess = () => {
    onClose();
    reset(defaultValues);
    queryClient.invalidateQueries({ queryKey: ["estoque"] });
    showAlert(
      `Requisição ${isUpdate ? "atualizada" : "criada"} com sucesso`,
      "success"
    );
  };

  const handleError = (error: any) => {
    console.error(error);
    showAlert(error.response?.data.message || error.message, "error");
  };

  const onSubmit = (data: RequisicaoEstoqueDto) => {
    if (isUpdate && requisicaoEstoque?.data) {
      updateRequisicaoEstoque(
        { id: requisicaoEstoque.data.id, data },
        { onSuccess: handleSuccess, onError: handleError }
      );
    } else {
      createRequisicaoEstoque(data, {
        onSuccess: handleSuccess,
        onError: handleError,
      });
    }
  };

  const handleInsumoChange = useCallback(
    (index: number, insumo?: InsumoDto | null) => {
      if (insumo) {
        setValue(`itens.${index}.unidade`, insumo.undEstoque);
        setValue(`itens.${index}.valorUnitario`, Number(insumo.valorUntMed));
      }
    },
    [setValue]
  );

  const handleAddItem = () => {
    prepend({
      id: null as any,
      quantidade: 0,
      unidade: null as any,
      valorUnitario: 0,
      insumo: null as any,
    });
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  // Renderização dos itens da requisição
  const renderItems = () => {
    if (fields.length === 0) {
      return (
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.02)"
                : "rgba(0, 0, 0, 0.02)",
          }}
        >
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Nenhum item adicionado
          </Typography>
          <Button
            startIcon={<IconPlus size={18} />}
            onClick={handleAddItem}
            variant="outlined"
            size="small"
          >
            Adicionar Primeiro Item
          </Button>
        </Box>
      );
    }

    return (
      <Box>
        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{
              px: 2,
              py: 2,
              mb: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
              "&:hover": {
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.03)"
                    : "rgba(0, 0, 0, 0.02)",
              },
            }}
          >
            <Grid2 container spacing={2}>
              <Grid2 size={4}>
                <Controller
                  name={`itens.${index}.insumo`}
                  control={control}
                  render={({ field }) => (
                    <InsumoAutoComplete
                      size="small"
                      field={{
                        ...field,
                        onChange: (value) => {
                          field.onChange(value);
                          handleInsumoChange(index, value);
                        },
                      }}
                      error={errors.itens?.[index]?.insumo}
                    />
                  )}
                />
              </Grid2>

              <Grid2 size={2}>
                <Controller
                  name={`itens.${index}.quantidade`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Quantidade"
                      error={!!errors.itens?.[index]?.quantidade}
                      helperText={errors.itens?.[index]?.quantidade?.message}
                      fullWidth
                      size="small"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </Grid2>

              <Grid2 size={3}>
                <Controller
                  name={`itens.${index}.unidade`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Unidade"
                      error={!!errors.itens?.[index]?.unidade}
                      helperText={errors.itens?.[index]?.unidade?.message}
                      value={field.value || ""}
                      fullWidth
                      select
                      size="small"
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

              <Grid2 size={2}>
                <Controller
                  name={`itens.${index}.valorUnitario`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Valor Unitário"
                      error={!!errors.itens?.[index]?.valorUnitario}
                      helperText={errors.itens?.[index]?.valorUnitario?.message}
                      disabled
                      fullWidth
                      size="small"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">R$</InputAdornment>
                          ),
                        },
                      }}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </Grid2>

              <Grid2
                size={1}
                container
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <IconButton
                  onClick={() => remove(index)}
                  color="error"
                  size="small"
                >
                  <IconCircleMinus />
                </IconButton>
              </Grid2>
            </Grid2>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      fullWidth
      maxWidth="xl"
      disableRestoreFocus
    >
      <DialogTitle>{isUpdate ? "Editar" : "Nova"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isUpdate
            ? "Preencha os campos abaixo para editar a requisição de estoque"
            : "Preencha os campos abaixo para criar uma nova requisição de estoque"}
        </DialogContentText>
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size="grow">
            <Controller
              name="valorTotal"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Valor total"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    },
                  }}
                  disabled
                  error={!!errors.valorTotal}
                  helperText={errors.valorTotal?.message}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? null : Number(value));
                  }}
                />
              )}
            />
          </Grid2>

          <Grid2 size={4}>
            <Controller
              name="armazem"
              control={control}
              render={({ field }) => (
                <ArmazemAutoComplete field={field} error={errors.armazem} />
              )}
            />
          </Grid2>

          <Grid2 size="auto">
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

          <Grid2 size={4}>
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

          <Grid2 size={4}>
            <Controller
              name="setor"
              control={control}
              render={({ field }) => (
                <SetorAutoComplete field={field} error={errors.setor} />
              )}
            />
          </Grid2>

          <Grid2 size={4}>
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

          {/* Items Section */}
          <Grid2 size={12}>
            <Box sx={{ mt: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
                gap={1}
              >
                <Divider textAlign="left" sx={{ flexGrow: 1 }}>
                  <Chip label="Itens da Requisição" />
                </Divider>
                <Button
                  startIcon={<IconPlus size={18} />}
                  onClick={handleAddItem}
                  variant="outlined"
                  size="small"
                >
                  adicionar item
                </Button>
              </Stack>

              {renderItems()}
            </Box>
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
