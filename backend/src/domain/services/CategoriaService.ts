import { Categoria } from "../entities/Categoria";
import { CrudService } from "./CrudService";

export interface CategoriaService extends CrudService<number, Categoria> {}
