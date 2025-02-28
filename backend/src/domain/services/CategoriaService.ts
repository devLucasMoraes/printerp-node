import {
  CreateCategoriaDTO,
  UpdateCategoriaDTO,
} from "../../http/validators/categoria.schemas";
import { Categoria } from "../entities/Categoria";
import { CrudService } from "./CrudService";

export interface CategoriaService
  extends CrudService<
    number,
    Categoria,
    CreateCategoriaDTO,
    UpdateCategoriaDTO
  > {}
