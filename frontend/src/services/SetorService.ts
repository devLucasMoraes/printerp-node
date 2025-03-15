import { SetorDto } from "../types";
import { CrudService } from "./CrudService";

class SetorService extends CrudService<number, SetorDto> {
  constructor() {
    super("/setores");
  }
}

export const setorService = new SetorService();
