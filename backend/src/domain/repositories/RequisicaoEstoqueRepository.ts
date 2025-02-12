import { appDataSource } from "../../database";
import { RequisicaoEstoque } from "../entities/RequisicaoEstoque";
import { BaseRepository, Page, PageRequest } from "./BaseRepository";

export class RequisicaoEstoqueRepository extends BaseRepository<RequisicaoEstoque> {
  constructor() {
    const repository = appDataSource.getRepository(RequisicaoEstoque);
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAllPaginated(
    pageRequest?: PageRequest
  ): Promise<Page<RequisicaoEstoque>> {
    return this.paginate(
      pageRequest,
      {},
      {
        requisitante: true,
        equipamento: true,
        itens: {
          insumo: true,
        },
      }
    );
  }
}
