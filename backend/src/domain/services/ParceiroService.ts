import {
  CreateParceiroDTO,
  UpdateParceiroDTO,
} from "../../http/validators/parceiro.schemas";
import { Parceiro } from "../entities/Parceiro";
import { CrudService } from "./CrudService";

export interface ParceiroService
  extends CrudService<number, Parceiro, CreateParceiroDTO, UpdateParceiroDTO> {}
