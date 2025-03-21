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
  MenuItem,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useEmprestimoQueries } from "../../../hooks/queries/useEmprestimosQueries";
import {
  emprestimoCreateSchema,
  emprestimoUpdateSchema,
} from "../../../schemas/emprestimo.schema";
import { useAlertStore } from "../../../stores/useAlertStore";
import { EmprestimoDto, InsumoDto } from "../../../types";
import { ArmazemAutoComplete } from "../../requisicoes-estoque/components/ArmazemAutoComplete";

export const EmprestimoModal = ({
  open,
  onClose,
  emprestimo,
}: {
  open: boolean;
  onClose: () => void;
  emprestimo?: {
    data: EmprestimoDto;
    type: "UPDATE" | "COPY" | "CREATE" | "DELETE";
  };
}) => {
  const { showAlert } = useAlertStore((state) => state);

  const queryClient = useQueryClient();

  const schema =
    emprestimo?.data && emprestimo.type === "UPDATE"
      ? emprestimoUpdateSchema
      : emprestimoCreateSchema;

  const { useCreate: useCreateEmprestimo, useUpdate: useUpdateEmprestimo } =
    useEmprestimoQueries();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<EmprestimoDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: null as any,
      dataEmprestimo: null as any,
      previsaoDevolucao: null as any,
      custoEstimado: 0,
      tipo: null as any,
      status: null as any,
      parceiro: null as any,
      armazem: null as any,
      itens: [],
    },
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

    setValue("custoEstimado", total);
  }, [items, setValue]);

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
        status: emprestimo.data.status,
        parceiro: emprestimo.data.parceiro,
        armazem: emprestimo.data.armazem,
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
        status: null as any,
        parceiro: null as any,
        armazem: null as any,
        itens: [],
      });
    }
  }, [emprestimo, reset]);

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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      fullWidth
      maxWidth="xl"
    >
      <DialogTitle>
        {emprestimo?.type === "UPDATE" ? "Editar" : "Novo"}
      </DialogTitle>
      <DialogContent>
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
                  select
                >
                  <MenuItem value="EM ABERTO">Em aberto</MenuItem>
                  <MenuItem value="BAIXADO">Baixado</MenuItem>
                </TextField>
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
