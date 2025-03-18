import { z } from "zod";

export const setorCreateSchema = z.object({
  nome: z.string().min(3, "Nome é obrigatório").max(255, "Nome muito longo"),
  userId: z.string().optional(),
});

export type CreateSetorDTO = z.infer<typeof setorCreateSchema>;

export const setorUpdateSchema = z.object({
  id: z.number(),
  nome: z.string().min(3, "Nome é obrigatório").max(255, "Nome muito longo"),
  userId: z.string().optional(),
});

export type UpdateSetorDTO = z.infer<typeof setorUpdateSchema>;

export const equipamentoParamsSchema = z.object({
  id: z.string().refine((value) => {
    return !isNaN(parseInt(value));
  }, "Id must be a number"),
});

export type SetorParamsSchema = z.infer<typeof equipamentoParamsSchema>;

export const setorQuerySchema = z.object({
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

export type SetorQuerySchema = z.infer<typeof setorQuerySchema>;
