import { InsumoDto } from "../types";
import { CrudService } from "./CrudService";

class InsumoService extends CrudService<number, InsumoDto> {
  constructor() {
    super("/insumos");
  }
}

export const insumoService = new InsumoService();
