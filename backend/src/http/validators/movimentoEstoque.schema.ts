import { z } from "zod";

export const movimentoEstoqueQuerySchema = z.object({
  page: z.string().optional(),
  size: z.string().optional(),
  sort: z.union([z.string(), z.array(z.string())]).optional(),
  //filtros
});

export type MovimentoEstoqueQuerySchema = z.infer<
  typeof movimentoEstoqueQuerySchema
>;
