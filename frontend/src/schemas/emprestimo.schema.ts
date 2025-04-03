import { z } from "zod";
import { Unidade } from "../constants/Unidade";

// Helpers reutilizáveis
const dateStringSchema = z.date();
const positiveNumberSchema = z.number().nonnegative();
const entityIdSchema = z.object({ id: z.number() });

// Schemas base
const baseDevolucaoItemSchema = z.object({
  dataDevolucao: dateStringSchema,
  quantidade: positiveNumberSchema,
  unidade: z.nativeEnum(Unidade),
  valorUnitario: positiveNumberSchema,
  insumo: entityIdSchema,
});

const baseEmprestimoItemSchema = z.object({
  quantidade: positiveNumberSchema,
  unidade: z.nativeEnum(Unidade),
  valorUnitario: positiveNumberSchema,
  insumo: entityIdSchema,
});

// Schemas derivados
const devolucaoItemCreateSchema = baseDevolucaoItemSchema.extend({
  id: z.null(),
});

const devolucaoItemUpdateSchema = baseDevolucaoItemSchema.extend({
  id: z.number().nullable(),
});

const emprestimoItemCreateSchema = baseEmprestimoItemSchema.extend({
  id: z.null(),
  devolucaoItens: z.array(devolucaoItemCreateSchema),
});

const emprestimoItemUpdateSchema = baseEmprestimoItemSchema.extend({
  id: z.number().nullable(),
  devolucaoItens: z.array(devolucaoItemUpdateSchema),
});

// Schema principal
const baseEmprestimoSchema = z.object({
  dataEmprestimo: dateStringSchema,
  previsaoDevolucao: dateStringSchema.nullable(),
  custoEstimado: positiveNumberSchema,
  tipo: z.string(),
  status: z.string(),
  parceiro: entityIdSchema,
  armazem: entityIdSchema,
  obs: z.string().nullable(),
  userId: z.string().optional(),
});

export const emprestimoCreateSchema = baseEmprestimoSchema.extend({
  itens: z.array(emprestimoItemCreateSchema),
});

export const emprestimoUpdateSchema = baseEmprestimoSchema.extend({
  id: z.number(),
  itens: z.array(emprestimoItemUpdateSchema),
});

// Tipos
export type CreateEmprestimoDTO = z.infer<typeof emprestimoCreateSchema>;
export type UpdateEmprestimoDTO = z.infer<typeof emprestimoUpdateSchema>;
