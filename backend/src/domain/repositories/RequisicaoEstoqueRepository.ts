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
        armazem: true,
        requisitante: true,
        setor: true,
        itens: {
          insumo: true,
        },
      }
    );
  }

  async findOneWithRelations(id: number): Promise<RequisicaoEstoque | null> {
    return await this.findOne({
      where: { id },
      relations: {
        armazem: true,
        requisitante: true,
        setor: true,
        itens: {
          insumo: true,
        },
      },
    });
  }
}
