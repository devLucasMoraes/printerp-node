import { z } from "zod";
import { Unidade } from "../../domain/entities/Unidade";

// Helpers reutilizáveis
const dateStringSchema = z.string().transform((str) => new Date(str));
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
  tipo: z.enum(["ENTRADA", "SAIDA"]),
  status: z.enum(["EM_ABERTO", "FECHADO"]),
  parceiro: entityIdSchema,
  armazem: entityIdSchema,
  userId: z.string().optional(),
});

export const emprestimoCreateSchema = baseEmprestimoSchema.extend({
  itens: z.array(emprestimoItemCreateSchema),
});

export const emprestimoUpdateSchema = baseEmprestimoSchema.extend({
  itens: z.array(emprestimoItemUpdateSchema),
});

// Tipos
export type CreateEmprestimoDTO = z.infer<typeof emprestimoCreateSchema>;
export type UpdateEmprestimoDTO = z.infer<typeof emprestimoUpdateSchema>;

// Parâmetros e queries simplificados
export const emprestimoParamsSchema = z.object({
  id: z.coerce.number().positive(),
});

export type EmprestimoParamsSchema = z.infer<typeof emprestimoParamsSchema>;

// Helper para ordenação
const sortSchema = z.string().refine((val) => {
  const [, direction] = val.split(",");
  return !direction || ["ASC", "DESC", "asc", "desc"].includes(direction);
}, "Direction must be ASC or DESC");

export const emprestimoQuerySchema = z.object({
  page: z.coerce.number().int().nonnegative().default(1),
  size: z.coerce.number().int().nonnegative().default(10),
  sort: z.union([sortSchema, z.array(sortSchema)]).optional(),
});

export type EmprestimoQuerySchema = z.infer<typeof emprestimoQuerySchema>;
