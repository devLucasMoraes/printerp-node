import { CategoriaRepository } from "./CategoriaRepository";
import { EquipamentoRepository } from "./EquipamentoRepository";
import { InsumoRepository } from "./InsumoRepository";
import { RequisicaoEstoqueRepository } from "./RequisicaoEstoqueRepository";
import { RequisitanteRepository } from "./RequisitanteRepository";
import { UserRepository } from "./UserRepository";

export const userRepository = new UserRepository();
export const categoriaRepository = new CategoriaRepository();
export const equipamentoRepository = new EquipamentoRepository();
export const requisicaoEstoqueRepository = new RequisicaoEstoqueRepository();
export const requisitanteRepository = new RequisitanteRepository();
export const insumoRepository = new InsumoRepository();
