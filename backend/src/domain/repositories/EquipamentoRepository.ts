import { appDataSource } from "../../database";
import { Equipamento } from "../entities/Equipamento";
import { BaseRepository, Page, PageRequest } from "./BaseRepository";

export class EquipamentoRepository extends BaseRepository<Equipamento> {
  constructor() {
    const repository = appDataSource.getRepository(Equipamento);
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAllPaginated(
    pageRequest?: PageRequest
  ): Promise<Page<Equipamento>> {
    return this.paginate(pageRequest);
  }
}
