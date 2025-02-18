import {
  CreateArmazemDTO,
  UpdateArmazemDTO,
} from "../../http/validators/armazem.schema";
import { Armazem } from "../entities/Armazem";
import { CrudService } from "./CrudService";

export interface ArmazemService
  extends CrudService<number, Armazem, CreateArmazemDTO, UpdateArmazemDTO> {}
