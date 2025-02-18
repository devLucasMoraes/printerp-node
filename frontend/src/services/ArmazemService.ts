import { ArmazemDto } from "../types";
import { CrudService } from "./CrudService";

class ArmazemService extends CrudService<number, ArmazemDto> {
  constructor() {
    super("/armazens");
  }
}

export const armazemService = new ArmazemService();
