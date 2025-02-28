import {
  CreateInsumoDTO,
  UpdateInsumoDTO,
} from "../../http/validators/insumo.schemas";
import { Insumo } from "../entities/Insumo";
import { CrudService } from "./CrudService";

export interface InsumoService
  extends CrudService<number, Insumo, CreateInsumoDTO, UpdateInsumoDTO> {}
