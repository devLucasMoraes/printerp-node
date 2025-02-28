import { z } from "zod";
import { Unidade } from "../../domain/entities/Unidade";

export const insumoCreateSchema = z.object({
  descricao: z
    .string()
    .min(3, "Nome é obrigatório")
    .max(255, "Nome muito longo"),
  valorUntMed: z.number().nonnegative(),
  valorUntMedAuto: z.boolean(),
  undEstoque: z.nativeEnum(Unidade),
  estoqueMinimo: z.number().nonnegative(),
  categoria: z.object({
    id: z.number(),
  }),
  userId: z.string().optional(),
});

export type CreateInsumoDTO = z.infer<typeof insumoCreateSchema>;

export const insumoUpdateSchema = z.object({
  descricao: z
    .string()
    .min(3, "Nome é obrigatório")
    .max(255, "Nome muito longo"),
  valorUntMed: z.number().nonnegative(),
  valorUntMedAuto: z.boolean(),
  undEstoque: z.nativeEnum(Unidade),
  estoqueMinimo: z.number().nonnegative(),
  categoria: z.object({
    id: z.number(),
  }),
});

export type InsumoUpdateDto = z.infer<typeof insumoUpdateSchema>;

export const insumoParamsSchema = z.object({
  id: z.string().refine((value) => {
    return !isNaN(parseInt(value));
  }, "Id must be a number"),
});

export type InsumoParamsSchema = z.infer<typeof insumoParamsSchema>;

export const insumoQuerySchema = z.object({
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

export type InsumoQuerySchema = z.infer<typeof insumoQuerySchema>;
