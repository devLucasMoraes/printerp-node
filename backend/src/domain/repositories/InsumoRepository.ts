import { appDataSource } from "../../database";
import { Insumo } from "../entities/Insumo";
import { BaseRepository, Page, PageRequest } from "./BaseRepository";

export class InsumoRepository extends BaseRepository<Insumo> {
  constructor() {
    const repository = appDataSource.getRepository(Insumo);
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<Insumo>> {
    return this.paginate(pageRequest, {}, { categoria: true });
  }
}
