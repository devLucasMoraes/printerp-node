import { z } from "zod";

export const setorCreateSchema = z.object({
  nome: z.string().min(3, "Nome é obrigatório").max(255, "Nome muito longo"),
});

export type SetorCreateDto = z.infer<typeof setorCreateSchema>;

export const setorUpdateSchema = z.object({
  id: z.number(),
  nome: z.string().min(3, "Nome é obrigatório").max(255, "Nome muito longo"),
});

export type SetorUpdateDto = z.infer<typeof setorUpdateSchema>;
