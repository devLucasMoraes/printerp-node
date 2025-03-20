import { EmprestimoDto } from "../types";
import { CrudService } from "./CrudService";

class EmprestimoService extends CrudService<number, EmprestimoDto> {
  constructor() {
    super("/emprestimos");
  }
}

export const emprestimoService = new EmprestimoService();
