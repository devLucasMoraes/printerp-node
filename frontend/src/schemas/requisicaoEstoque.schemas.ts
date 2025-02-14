import { z } from "zod";
import { Unidade } from "../constants/Unidade";

const requisicaoEstoqueItemCreateSchema = z.object({
  id: z.null(),
  quantidade: z.number().nonnegative(),
  undEstoque: z.nativeEnum(Unidade),
  valorUnitario: z.number().nonnegative(),
  insumo: z.object({
    id: z.number(),
  }),
});

const requisicaoEstoqueItemUpdateSchema = z.object({
  id: z.number().nullable(),
  quantidade: z.number().nonnegative(),
  undEstoque: z.nativeEnum(Unidade),
  valorUnitario: z.number().nonnegative(),
  insumo: z.object({
    id: z.number(),
  }),
});

export const requisicaoEstoqueCreateSchema = z.object({
  dataRequisicao: z.date(),
  ordemProducao: z.string().nonempty(),
  valorTotal: z.number().nonnegative(),
  obs: z.string().nullable(),
  requisitante: z.object({
    id: z.number(),
  }),
  equipamento: z.object({
    id: z.number(),
  }),
  itens: z.array(requisicaoEstoqueItemCreateSchema),
});

export type RequisicaoEstoqueCreateDto = z.infer<
  typeof requisicaoEstoqueCreateSchema
>;

export const requisicaoEstoqueUpdateSchema = z.object({
  dataRequisicao: z.date(),
  ordemProducao: z.string().nonempty(),
  valorTotal: z.number().nonnegative(),
  obs: z.string().nullable(),
  requisitante: z.object({
    id: z.number(),
  }),
  equipamento: z.object({
    id: z.number(),
  }),
  itens: z.array(requisicaoEstoqueItemUpdateSchema),
});

export type RequisicaoEstoqueUpdateDto = z.infer<
  typeof requisicaoEstoqueUpdateSchema
>;
