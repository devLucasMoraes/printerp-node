import { z } from "zod";

export const adjustEstoqueSchema = z.object({
  id: z.number(),
  quantidade: z.number(),
});

export type AdjustEstoqueDTO = z.infer<typeof adjustEstoqueSchema>;
