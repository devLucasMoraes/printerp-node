import { Requisitante } from "../entities/Requisitante";
import { CrudService } from "./CrudService";

export interface RequisitanteService
  extends CrudService<number, Requisitante, Requisitante, Requisitante> {}
