import { z } from "zod";

export const estoqueAdjustSchema = z.object({
  id: z.number(),
  quantidade: z.number(),
});

export type EstoqueAdjustDTO = z.infer<typeof estoqueAdjustSchema>;
