import { z } from "zod";

export const equipamentoCreateSchema = z.object({
  nome: z.string().min(3, "Nome é obrigatório").max(255, "Nome muito longo"),
});

export type EquipamentoCreateDto = z.infer<typeof equipamentoCreateSchema>;

export const equipamentoUpdateSchema = z.object({
  nome: z.string().min(3, "Nome é obrigatório").max(255, "Nome muito longo"),
});

export type EquipamentoUpdateDto = z.infer<typeof equipamentoUpdateSchema>;
