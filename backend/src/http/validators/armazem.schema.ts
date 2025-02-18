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

export const armazemParamsSchema = z.object({
  id: z.string().refine((value) => {
    return !isNaN(parseInt(value));
  }, "Id must be a number"),
});

export type ArmazemParamsSchema = z.infer<typeof armazemParamsSchema>;

export const armazemQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 1))
    .refine((val) => val >= 0, "Page must be greater than or equal to 0"),
  size: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 10))
    .refine((val) => val >= 0, "Page must be greater than or equal to 0"),
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

export type ArmazemQuerySchema = z.infer<typeof armazemQuerySchema>;
