import { Insumo } from "../entities/Insumo";
import { CrudService } from "./CrudService";

export interface InsumoService
  extends CrudService<number, Insumo, Insumo, Insumo> {}
