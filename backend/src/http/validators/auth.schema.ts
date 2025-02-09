import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(6, "Senha muito curta")
    .max(100, "Nome muito longo")
    .nonempty("Senha é obrigatória"),
});

export type loginSchema = z.infer<typeof loginSchema>;

export const signUpSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .max(100, "Senha muito longa"),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
