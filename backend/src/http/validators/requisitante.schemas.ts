import { z } from "zod";

export const requisitanteCreateSchema = z.object({
  nome: z.string().min(3, "Nome é obrigatório").max(255, "Nome muito longo"),
  fone: z.string().max(20, "Telefone muito longo"),
  userId: z.string().optional(),
});

export type CreateRequisitanteDTO = z.infer<typeof requisitanteCreateSchema>;

export const requisitanteUpdateSchema = z.object({
  id: z.number(),
  nome: z.string().min(3, "Nome é obrigatório").max(255, "Nome muito longo"),
  fone: z.string().max(20, "Telefone muito longo"),
  userId: z.string().optional(),
});

export type UpdateRequisitanteDTO = z.infer<typeof requisitanteUpdateSchema>;

export const requisitanteParamsSchema = z.object({
  id: z.string().refine((value) => {
    return !isNaN(parseInt(value));
  }, "Id must be a number"),
});

export type RequisitanteParamsSchema = z.infer<typeof requisitanteParamsSchema>;

export const requisitanteQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 1)),
  size: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 10)),
  sort: z
    .union([
      z.string().refine((val) => {
        const [field, direction] = val.split(",");
        return !direction || ["ASC", "DESC", "asc", "desc"].includes(direction);
      }, "Direction must be ASC or DESC"),
      z.array(
        z.string().refine((val) => {
          const [field, direction] = val.split(",");
          return (
            !direction || ["ASC", "DESC", "asc", "desc"].includes(direction)
          );
        }, "Direction must be ASC or DESC")
      ),
    ])
    .optional(),
});

export type RequisitanteQuerySchema = z.infer<typeof requisitanteQuerySchema>;
