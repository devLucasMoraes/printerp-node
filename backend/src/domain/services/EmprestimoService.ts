import {
  CreateEmprestimoDTO,
  UpdateEmprestimoDTO,
} from "../../http/validators/emprestimo.schema";
import { Emprestimo } from "../entities/Emprestimo";
import { CrudService } from "./CrudService";

export interface EmprestimoService
  extends CrudService<
    number,
    Emprestimo,
    CreateEmprestimoDTO,
    UpdateEmprestimoDTO
  > {}
