import { z } from "zod";

import { Unidade } from "../../domain/entities/Unidade";

const requisicaoEstoqueItemSchema = z.object({
  id: z.number().nullable(),
  quantidade: z.number().nonnegative(),
  undEstoque: z.nativeEnum(Unidade),
  valorUnitario: z.number().nonnegative(),
  insumo: z.object({
    id: z.number(),
  }),
});

export const requisicaoEstoqueCreateSchema = z.object({
  dataRequisicao: z.string().transform((str) => new Date(str)),
  ordemProducao: z.string().nonempty(),
  valorTotal: z.number().nonnegative(),
  obs: z.string().nullable(),
  requisitante: z.object({
    id: z.number(),
  }),
  equipamento: z.object({
    id: z.number(),
  }),
  itens: z.array(requisicaoEstoqueItemSchema),
});

export type RequisicaoEstoqueCreateDto = z.infer<
  typeof requisicaoEstoqueCreateSchema
>;

export const requisicaoEstoqueUpdateSchema = z.object({
  dataRequisicao: z.string().transform((str) => new Date(str)),
  ordemProducao: z.string().nonempty(),
  valorTotal: z.number().nonnegative(),
  obs: z.string().nullable(),
  requisitante: z.object({
    id: z.number(),
  }),
  equipamento: z.object({
    id: z.number(),
  }),
  itens: z.array(requisicaoEstoqueItemSchema),
});

export type RequisicaoEstoqueUpdateDto = z.infer<
  typeof requisicaoEstoqueUpdateSchema
>;

export const requisicaoEstoqueParamsSchema = z.object({
  id: z.string().refine((value) => {
    return !isNaN(parseInt(value));
  }, "Id must be a number"),
});

export type RequisicaoEstoqueParamsSchema = z.infer<
  typeof requisicaoEstoqueParamsSchema
>;

export const requisicaoEstoqueQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 1)),
  size: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 10)),
  sort: z
    .union([
      z.string().refine((val) => {
        const [field, direction] = val.split(",");
        return !direction || ["ASC", "DESC", "asc", "desc"].includes(direction);
      }, "Direction must be ASC or DESC"),
      z.array(
        z.string().refine((val) => {
          const [field, direction] = val.split(",");
          return (
            !direction || ["ASC", "DESC", "asc", "desc"].includes(direction)
          );
        }, "Direction must be ASC or DESC")
      ),
    ])
    .optional(),
});

export type RequisicaoEstoqueQuerySchema = z.infer<
  typeof requisicaoEstoqueQuerySchema
>;
