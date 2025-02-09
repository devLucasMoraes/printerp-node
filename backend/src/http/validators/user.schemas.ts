import { z } from "zod";

export const userCreateSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório").max(100, "Nome muito longo"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha muito curta").max(100, "Nome muito longo"),
  role: z.enum(["admin", "user"]),
});

export type UserCreateSchema = z.infer<typeof userCreateSchema>;

export const userUpdateSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório").max(100, "Nome muito longo"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha muito curta").max(100, "Nome muito longo"),
  role: z.enum(["admin", "user"]),
});
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;

export const userParamsSchema = z.object({
  id: z.string().uuid(),
});

export type UserParamsSchema = z.infer<typeof userParamsSchema>;

export const userQuerySchema = z.object({
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

export type UserQuerySchema = z.infer<typeof userQuerySchema>;
