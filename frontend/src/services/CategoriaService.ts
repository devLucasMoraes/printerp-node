import { CategoriaDto } from "../types";
import { CrudService } from "./CrudService";

class CategoriaService extends CrudService<number, CategoriaDto> {
  constructor() {
    super("/categorias");
  }
}

export const categoriaService = new CategoriaService();
