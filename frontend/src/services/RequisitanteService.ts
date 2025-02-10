import { RequisitanteDto } from "../types";
import { CrudService } from "./CrudService";

class RequisitanteService extends CrudService<number, RequisitanteDto> {
  constructor() {
    super("/requisitantes");
  }
}

export const requisitanteService = new RequisitanteService();
