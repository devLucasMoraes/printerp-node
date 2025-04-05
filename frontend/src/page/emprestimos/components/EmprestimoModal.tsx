import { zodResolver } from "@hookform/resolvers/zod";
import {
  Badge,
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
import {
  IconCircleArrowDownFilled,
  IconCircleMinus,
  IconPlus,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { ArmazemAutoComplete } from "../../../components/shared/autocompletes/ArmazemAutoComplete";
import { InsumoAutoComplete } from "../../../components/shared/autocompletes/InsumoAutoComplete";
import { ParceiroAutoComplete } from "../../../components/shared/autocompletes/ParceiroAutoComplete";
import { unidades } from "../../../constants";
import { useEmprestimoQueries } from "../../../hooks/queries/useEmprestimosQueries";
import {
  emprestimoCreateSchema,
  emprestimoUpdateSchema,
} from "../../../schemas/emprestimo.schema";
import { useAlertStore } from "../../../stores/useAlertStore";
import { EmprestimoDto, InsumoDto } from "../../../types";
import { DevolucaoModal } from "./DevolucaoModal";

export const EmprestimoModal = ({
  open,
  onClose,
  emprestimo,
}: {
  open: boolean;
  onClose: () => void;
  emprestimo?: {
    data?: EmprestimoDto;
    type: "UPDATE" | "COPY" | "CREATE" | "DELETE";
  };
}) => {
  const [devolucaoModalOpen, setDevolucaoModalOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

  const { showAlert } = useAlertStore((state) => state);

  const queryClient = useQueryClient();

  const schema =
    emprestimo?.data && emprestimo.type === "UPDATE"
      ? emprestimoUpdateSchema
      : emprestimoCreateSchema;

  const { useCreate: useCreateEmprestimo, useUpdate: useUpdateEmprestimo } =
    useEmprestimoQueries();

  const methods = useForm<EmprestimoDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: null as any,
      dataEmprestimo: null as any,
      previsaoDevolucao: null as any,
      custoEstimado: 0,
      tipo: null as any,
      status: "EM_ABERTO",
      parceiro: null as any,
      armazem: null as any,
      obs: null,
      itens: [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = methods;

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

    setValue("custoEstimado", Number(total.toFixed(2)));
  }, [items]);

  useEffect(() => {
    if (emprestimo?.data && emprestimo.type === "UPDATE") {
      reset({
        id: emprestimo.data.id,
        dataEmprestimo: new Date(emprestimo.data.dataEmprestimo),
        previsaoDevolucao: emprestimo.data.previsaoDevolucao
          ? new Date(emprestimo.data.previsaoDevolucao)
          : null,
        custoEstimado: Number(emprestimo.data.custoEstimado),
        tipo: emprestimo.data.tipo,
        status: emprestimo.data.status,
        parceiro: emprestimo.data.parceiro,
        armazem: emprestimo.data.armazem,
        obs: emprestimo.data.obs,
        itens: emprestimo.data.itens.map((item) => ({
          id: item.id,
          insumo: item.insumo,
          quantidade: Number(item.quantidade),
          valorUnitario: Number(item.valorUnitario),
          unidade: item.unidade,
          devolucaoItens: item.devolucaoItens.map((devolucaoItem) => ({
            id: devolucaoItem.id,
            insumo: devolucaoItem.insumo,
            quantidade: Number(devolucaoItem.quantidade),
            valorUnitario: Number(devolucaoItem.valorUnitario),
            unidade: devolucaoItem.unidade,
            dataDevolucao: new Date(devolucaoItem.dataDevolucao),
          })),
        })),
      });
    } else if (emprestimo?.data && emprestimo.type === "COPY") {
      reset({
        id: emprestimo.data.id,
        dataEmprestimo: new Date(emprestimo.data.dataEmprestimo),
        previsaoDevolucao: emprestimo.data.previsaoDevolucao
          ? new Date(emprestimo.data.previsaoDevolucao)
          : null,
        custoEstimado: Number(emprestimo.data.custoEstimado),
        tipo: emprestimo.data.tipo,
        status: "EM_ABERTO",
        parceiro: emprestimo.data.parceiro,
        armazem: emprestimo.data.armazem,
        obs: emprestimo.data.obs,
        itens: emprestimo.data.itens.map((item) => ({
          id: item.id,
          insumo: item.insumo,
          quantidade: Number(item.quantidade),
          valorUnitario: Number(item.valorUnitario),
          unidade: item.unidade,
          devolucaoItens: item.devolucaoItens.map((devolucaoItem) => ({
            id: devolucaoItem.id,
            insumo: devolucaoItem.insumo,
            quantidade: Number(devolucaoItem.quantidade),
            valorUnitario: Number(devolucaoItem.valorUnitario),
            unidade: devolucaoItem.unidade,
            dataDevolucao: new Date(devolucaoItem.dataDevolucao),
          })),
        })),
      });
    } else {
      reset({
        id: null as any,
        dataEmprestimo: null as any,
        previsaoDevolucao: null as any,
        custoEstimado: 0,
        tipo: null as any,
        status: "EM_ABERTO",
        parceiro: null as any,
        armazem: null as any,
        obs: null,
        itens: [],
      });
    }
  }, [emprestimo]);

  const { mutate: createEmprestimo } = useCreateEmprestimo();
  const { mutate: updateEmprestimo } = useUpdateEmprestimo();

  const onSubmit = (data: EmprestimoDto) => {
    if (emprestimo?.data && emprestimo?.type === "UPDATE") {
      updateEmprestimo(
        {
          id: emprestimo.data.id,
          data,
        },
        {
          onSuccess: () => {
            onClose();
            reset();
            queryClient.invalidateQueries({ queryKey: ["emprestimos"] });
            showAlert("Emprestimo atualizado com sucesso", "success");
          },
          onError: (error) => {
            console.error(error);
            showAlert(error.response?.data.message || error.message, "error");
          },
        }
      );
    }

    if (emprestimo?.type === "CREATE") {
      createEmprestimo(data, {
        onSuccess: () => {
          onClose();
          reset();
          queryClient.invalidateQueries({ queryKey: ["emprestimos"] });
          showAlert("Emprestimo criado com sucesso", "success");
        },
        onError: (error) => {
          console.error(error);
          showAlert(error.response?.data.message || error.message, "error");
        },
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
      devolucaoItens: [],
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleOpenDevolucaoModal = (index: number) => {
    setSelectedItemIndex(index);
    setDevolucaoModalOpen(true);
  };

  const renderModals = () => (
    <>
      {selectedItemIndex >= 0 && (
        <DevolucaoModal
          open={devolucaoModalOpen}
          onClose={() => {
            setDevolucaoModalOpen(false);
            setSelectedItemIndex(-1);
          }}
          itemIndex={selectedItemIndex}
        />
      )}
    </>
  );

  return (
    <FormProvider {...methods}>
      <Dialog
        open={open}
        onClose={handleClose}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        fullWidth
        maxWidth="xl"
        disableRestoreFocus
      >
        <DialogTitle>
          {emprestimo?.type === "UPDATE" ? "Editar" : "Novo"}
        </DialogTitle>
        <DialogContent>
          {renderModals()}
          <DialogContentText>
            {emprestimo?.type === "UPDATE"
              ? "Atualize os dados do emprestimo"
              : "Crie um novo emprestimo"}
          </DialogContentText>
          <Grid2 container spacing={2} sx={{ mt: 2 }}>
            <Grid2 size={3}>
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tipo"
                    error={!!errors.tipo}
                    helperText={errors.tipo?.message}
                    fullWidth
                    select
                  >
                    <MenuItem value="ENTRADA">Entrada</MenuItem>
                    <MenuItem value="SAIDA">Saida</MenuItem>
                  </TextField>
                )}
              />
            </Grid2>

            <Grid2 size={3}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Status"
                    error={!!errors.status}
                    helperText={errors.status?.message}
                    fullWidth
                    disabled
                  />
                )}
              />
            </Grid2>

            <Grid2 size={3}>
              <Controller
                name="previsaoDevolucao"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Previsão de devolução"
                    slotProps={{
                      textField: {
                        error: !!errors.previsaoDevolucao,
                        helperText: errors.previsaoDevolucao?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid2>

            <Grid2 size={3}>
              <Controller
                name="dataEmprestimo"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Emprestado em"
                    slotProps={{
                      textField: {
                        error: !!errors.dataEmprestimo,
                        helperText: errors.dataEmprestimo?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid2>

            <Grid2 size={4}>
              <Controller
                name="custoEstimado"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Custo estimado"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">R$</InputAdornment>
                        ),
                      },
                    }}
                    disabled
                    error={!!errors.custoEstimado}
                    helperText={errors.custoEstimado?.message}
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

            <Grid2 size={4}>
              <Controller
                name="parceiro"
                control={control}
                render={({ field }) => (
                  <ParceiroAutoComplete field={field} error={errors.parceiro} />
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

                {fields.length === 0 ? (
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
                ) : (
                  <Box>
                    {fields.map((field, index) => {
                      return (
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
                                    helperText={
                                      errors.itens?.[index]?.quantidade?.message
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                )}
                              />
                            </Grid2>

                            <Grid2 size={2}>
                              <Controller
                                name={`itens.${index}.unidade`}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label="Unidade"
                                    error={!!errors.itens?.[index]?.unidade}
                                    helperText={
                                      errors.itens?.[index]?.unidade?.message
                                    }
                                    value={field.value || ""}
                                    fullWidth
                                    select
                                    size="small"
                                  >
                                    {unidades.map((option) => (
                                      <MenuItem
                                        key={option.value}
                                        value={option.value}
                                      >
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
                                    error={
                                      !!errors.itens?.[index]?.valorUnitario
                                    }
                                    helperText={
                                      errors.itens?.[index]?.valorUnitario
                                        ?.message
                                    }
                                    disabled
                                    fullWidth
                                    size="small"
                                    slotProps={{
                                      input: {
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            R$
                                          </InputAdornment>
                                        ),
                                      },
                                    }}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                )}
                              />
                            </Grid2>

                            <Grid2
                              size={2}
                              container
                              direction="row"
                              alignItems="center"
                              justifyContent="flex-end"
                            >
                              <Badge
                                badgeContent={
                                  watch(`itens.${index}.devolucaoItens`)
                                    ?.length || 0
                                }
                                color="primary"
                              >
                                <IconButton
                                  onClick={() =>
                                    handleOpenDevolucaoModal(index)
                                  }
                                  size="small"
                                >
                                  <IconCircleArrowDownFilled />
                                </IconButton>
                              </Badge>
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
                      );
                    })}
                  </Box>
                )}
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
    </FormProvider>
  );
};
