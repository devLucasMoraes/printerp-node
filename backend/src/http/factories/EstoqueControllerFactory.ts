import { EstoqueRepository } from "../../domain/repositories/EstoqueRepository";
import { ListEstoqueUseCase } from "../../domain/useCases/estoque/ListEstoqueEstoqueUseCase";
import { EstoqueServiceImpl } from "../../services/estoque/EstoqueService";
import { EstoqueController } from "../controllers/EstoqueController";

export class EstoqueControllerFactory {
  private static createRepositories() {
    const estoqueRepository = new EstoqueRepository();

    return {
      estoqueRepository,
    };
  }

  private static createEstoqueUseCases(
    repos: ReturnType<typeof EstoqueControllerFactory.createRepositories>
  ) {
    return {
      list: new ListEstoqueUseCase(repos.estoqueRepository),
    };
  }

  static create(): EstoqueController {
    const repositories = this.createRepositories();
    const estoqueUseCases = this.createEstoqueUseCases(repositories);

    const service = new EstoqueServiceImpl(estoqueUseCases.list);

    return new EstoqueController(service);
  }
}
