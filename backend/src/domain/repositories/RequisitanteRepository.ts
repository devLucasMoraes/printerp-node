import { appDataSource } from "../../database";
import { Requisitante } from "../entities/Requisitante";
import { BaseRepository, Page, PageRequest } from "./BaseRepository";

export class RequisitanteRepository extends BaseRepository<Requisitante> {
  constructor() {
    const repository = appDataSource.getRepository(Requisitante);
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAllPaginated(
    pageRequest?: PageRequest
  ): Promise<Page<Requisitante>> {
    return this.paginate(pageRequest);
  }
}
