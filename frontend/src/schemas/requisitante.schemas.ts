import { z } from "zod";

export const requisitanteCreateSchema = z.object({
  nome: z.string().min(3, "Nome é obrigatório").max(255, "Nome muito longo"),
  fone: z.string().max(20, "Telefone muito longo"),
});

export type RequisitanteCreateDto = z.infer<typeof requisitanteCreateSchema>;

export const requisitanteUpdateSchema = z.object({
  id: z.number(),
  nome: z.string().min(3, "Nome é obrigatório").max(255, "Nome muito longo"),
  fone: z.string().max(20, "Telefone muito longo"),
});

export type RequisitanteUpdateDto = z.infer<typeof requisitanteUpdateSchema>;
