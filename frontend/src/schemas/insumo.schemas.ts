import { z } from "zod";
import { Unidade } from "../constants/Unidade";

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
});

export type InsumoCreateDto = z.infer<typeof insumoCreateSchema>;

export const insumoUpdateSchema = z.object({
  id: z.number(),
  descricao: z
    .string()
    .min(3, "Nome é obrigatório")
    .max(255, "Nome muito longo"),
  valorUntMed: z.coerce.number().nonnegative(),
  valorUntMedAuto: z.boolean(),
  undEstoque: z.nativeEnum(Unidade),
  estoqueMinimo: z.coerce.number().nonnegative(),
  categoria: z.object({
    id: z.number(),
  }),
});

export type InsumoUpdateDto = z.infer<typeof insumoUpdateSchema>;
