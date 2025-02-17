import {
  CreateRequisicaoEstoqueDTO,
  UpdateRequisicaoEstoqueDTO,
} from "../../http/validators/requisicaoEstoque.schemas";
import { RequisicaoEstoque } from "../entities/RequisicaoEstoque";
import { CrudService } from "./CrudService";

export interface RequisicaoEstoqueService
  extends CrudService<
    number,
    RequisicaoEstoque,
    CreateRequisicaoEstoqueDTO,
    UpdateRequisicaoEstoqueDTO
  > {}
