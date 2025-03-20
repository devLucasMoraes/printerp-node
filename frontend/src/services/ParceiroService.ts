import { ParceiroDto } from "../types";
import { CrudService } from "./CrudService";

class ParceiroService extends CrudService<number, ParceiroDto> {
  constructor() {
    super("/parceiros");
  }
}

export const parceiroService = new ParceiroService();
