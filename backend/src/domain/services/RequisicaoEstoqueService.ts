import { RequisicaoEstoque } from "../entities/RequisicaoEstoque";
import { CrudService } from "./CrudService";

export interface RequisicaoEstoqueService
  extends CrudService<number, RequisicaoEstoque> {}
