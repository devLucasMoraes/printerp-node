import { z } from "zod";

export const adjustEstoqueSchema = z.object({
  id: z.number(),
  quantidade: z.number(),
  userId: z.string().optional(),
});

export type AdjustEstoqueDTO = z.infer<typeof adjustEstoqueSchema>;

export const estoqueParamsSchema = z.object({
  id: z.string().refine((value) => {
    return !isNaN(parseInt(value));
  }, "Id must be a number"),
});

export type EstoqueParamsSchema = z.infer<typeof estoqueParamsSchema>;

export const estoqueQuerySchema = z.object({
  page: z.string().optional(),
  size: z.string().optional(),
  sort: z.union([z.string(), z.array(z.string())]).optional(),
  //filtros
  insumo: z.string().optional(),
  abaixoMinimo: z.boolean().optional(),
});

export type EstoqueQuerySchema = z.infer<typeof estoqueQuerySchema>;
