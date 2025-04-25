import { z } from "zod";

export const userCreateSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório").max(100, "Nome muito longo"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha muito curta").max(100, "Nome muito longo"),
  role: z.enum(["admin", "user"]).default("user"),
  userId: z.string().uuid(),
});

export type CreateUserDTO = z.infer<typeof userCreateSchema>;

export const userUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, "Nome é obrigatório").max(100, "Nome muito longo"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha muito curta").max(100, "Nome muito longo"),
  role: z.enum(["admin", "user"]).default("user"),
  userId: z.string().uuid(),
});
export type UpdateUserDTO = z.infer<typeof userUpdateSchema>;

export const userParamsSchema = z.object({
  id: z.string().uuid(),
});

export type UserParamsSchema = z.infer<typeof userParamsSchema>;

export const userQuerySchema = z.object({
  page: z.string().optional(),
  size: z.string().optional(),
  sort: z.union([z.string(), z.array(z.string())]).optional(),
  //filtros
});

export type UserQuerySchema = z.infer<typeof userQuerySchema>;
