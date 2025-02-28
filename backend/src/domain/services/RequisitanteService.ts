import {
  CreateRequisitanteDTO,
  UpdateRequisitanteDTO,
} from "../../http/validators/requisitante.schemas";
import { Requisitante } from "../entities/Requisitante";
import { CrudService } from "./CrudService";

export interface RequisitanteService
  extends CrudService<
    number,
    Requisitante,
    CreateRequisitanteDTO,
    UpdateRequisitanteDTO
  > {}
