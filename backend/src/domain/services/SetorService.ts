import {
  CreateSetorDTO,
  UpdateSetorDTO,
} from "../../http/validators/setor.schemas";
import { Setor } from "../entities/Setor";
import { CrudService } from "./CrudService";

export interface SetorService
  extends CrudService<number, Setor, CreateSetorDTO, UpdateSetorDTO> {}
