import { z } from "zod";

export const categoriaCreateSchema = z.object({
  nome: z.string().min(3, "Nome é obrigatório").max(255, "Nome muito longo"),
});

export type CategoriaCreateDto = z.infer<typeof categoriaCreateSchema>;

export const categoriaUpdateSchema = z.object({
  nome: z.string().min(3, "Nome é obrigatório").max(255, "Nome muito longo"),
});

export type CategoriaUpdateDto = z.infer<typeof categoriaUpdateSchema>;

export const categoriaParamsSchema = z.object({
  id: z.string().refine((value) => {
    return !isNaN(parseInt(value));
  }, "Id must be a number"),
});

export type CategoriaParamsSchema = z.infer<typeof categoriaParamsSchema>;

export const categoriaQuerySchema = z.object({
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

export type CategoriaQuerySchema = z.infer<typeof categoriaQuerySchema>;
