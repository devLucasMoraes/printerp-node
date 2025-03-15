import { appDataSource } from "../../database";
import { Setor } from "../entities/Setor";
import { BaseRepository, Page, PageRequest } from "./BaseRepository";

export class SetorRepository extends BaseRepository<Setor> {
  constructor() {
    const repository = appDataSource.getRepository(Setor);
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<Setor>> {
    return this.paginate(pageRequest);
  }
}
