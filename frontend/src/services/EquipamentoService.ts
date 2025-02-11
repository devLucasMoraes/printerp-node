import { EquipamentoDto } from "../types";
import { CrudService } from "./CrudService";

class EquipamentoService extends CrudService<number, EquipamentoDto> {
  constructor() {
    super("/equipamentos");
  }
}

export const equipamentoService = new EquipamentoService();
