import { z } from "zod";

export const armazemCreateSchema = z.object({
  nome: z.string().nonempty(),
});

export type CreateArmazemDTO = z.infer<typeof armazemCreateSchema>;

export const armazemUpdateSchema = z.object({
  id: z.number(),
  nome: z.string().nonempty(),
});

export type UpdateArmazemDTO = z.infer<typeof armazemUpdateSchema>;
