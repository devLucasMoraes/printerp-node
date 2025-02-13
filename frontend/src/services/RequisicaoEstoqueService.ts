import { RequisicaoEstoqueDto } from "../types";
import { CrudService } from "./CrudService";

class RequisicaoEstoqueService extends CrudService<
  number,
  RequisicaoEstoqueDto
> {
  constructor() {
    super("/requisicoes-estoque");
  }
}

export const requisicaoEstoqueService = new RequisicaoEstoqueService();
