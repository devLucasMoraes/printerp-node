import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, "Nome é obrigatório").max(100, "Nome muito longo"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha muito curta").max(100, "Nome muito longo"),
  profile: z.enum(["admin", "user"]),
});

export type UserDto = z.infer<typeof userSchema>;

export const userCreateSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório").max(100, "Nome muito longo"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha muito curta").max(100, "Nome muito longo"),
  profile: z.enum(["admin", "user"]),
});

export type UserCreateSchema = z.infer<typeof userCreateSchema>;

export const userUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, "Nome é obrigatório").max(100, "Nome muito longo"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha muito curta").max(100, "Nome muito longo"),
  profile: z.enum(["admin", "user"]),
});

export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
