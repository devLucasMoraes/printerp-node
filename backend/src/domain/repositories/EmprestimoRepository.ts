import { appDataSource } from "../../database";
import { Emprestimo } from "../entities/Emprestimo";
import { BaseRepository, Page, PageRequest } from "./BaseRepository";

export class EmprestimoRepository extends BaseRepository<Emprestimo> {
  constructor() {
    const repository = appDataSource.getRepository(Emprestimo);
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<Emprestimo>> {
    return this.paginate(
      pageRequest,
      {},
      {
        armazem: true,
        itens: {
          insumo: true,
          devolucaoItens: {
            insumo: true,
          },
        },
      }
    );
  }

  async findOneWithRelations(id: number): Promise<Emprestimo | null> {
    return await this.findOne({
      where: { id },
      relations: {
        armazem: true,
        itens: {
          insumo: true,
          devolucaoItens: {
            insumo: true,
          },
        },
      },
    });
  }
}
