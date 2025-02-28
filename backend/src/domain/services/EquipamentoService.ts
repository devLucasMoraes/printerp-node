import {
  CreateEquipamentoDTO,
  UpdateEquipamentoDTO,
} from "../../http/validators/equipamento.schemas";
import { Equipamento } from "../entities/Equipamento";
import { CrudService } from "./CrudService";

export interface EquipamentoService
  extends CrudService<
    number,
    Equipamento,
    CreateEquipamentoDTO,
    UpdateEquipamentoDTO
  > {}
