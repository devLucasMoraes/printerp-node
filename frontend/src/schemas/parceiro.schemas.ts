import { z } from "zod";

export const parceiroCreateSchema = z.object({
  nome: z.string().min(3, "Nome é obrigatório").max(255, "Nome muito longo"),
  fone: z.string().max(20, "Telefone muito longo"),
  userId: z.string().optional(),
});

export type CreateParceiroDTO = z.infer<typeof parceiroCreateSchema>;

export const parceiroUpdateSchema = z.object({
  id: z.number(),
  nome: z.string().min(3, "Nome é obrigatório").max(255, "Nome muito longo"),
  fone: z.string().max(20, "Telefone muito longo"),
  userId: z.string().optional(),
});

export type UpdateParceiroDTO = z.infer<typeof parceiroUpdateSchema>;

export const parceiroParamsSchema = z.object({
  id: z.string().refine((value) => {
    return !isNaN(parseInt(value));
  }, "Id must be a number"),
});
