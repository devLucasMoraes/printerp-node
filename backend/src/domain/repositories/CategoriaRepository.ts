import { appDataSource } from "../../database";
import { Categoria } from "../entities/Categoria";
import { BaseRepository, Page, PageRequest } from "./BaseRepository";

export class CategoriaRepository extends BaseRepository<Categoria> {
  constructor() {
    const repository = appDataSource.getRepository(Categoria);
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<Categoria>> {
    return this.paginate(pageRequest);
  }
}
