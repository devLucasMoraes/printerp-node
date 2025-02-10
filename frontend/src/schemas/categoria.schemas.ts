import { z } from "zod";

export const categoriaCreateSchema = z.object({
  nome: z.string().min(3, "Nome é obrigatório").max(255, "Nome muito longo"),
});

export type CategoriaCreateDto = z.infer<typeof categoriaCreateSchema>;

export const categoriaUpdateSchema = z.object({
  id: z.number(),
  nome: z.string().min(3, "Nome é obrigatório").max(255, "Nome muito longo"),
});

export type CategoriaUpdateDto = z.infer<typeof categoriaUpdateSchema>;
