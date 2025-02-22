import { EstoqueRepository } from "../../domain/repositories/EstoqueRepository";
import { MovimentoEstoqueRepository } from "../../domain/repositories/MovimentoEstoqueRepository";
import { AdjustEstoqueUseCase } from "../../domain/useCases/estoque/AdjustEstoqueUseCase";
import { ListEstoqueUseCase } from "../../domain/useCases/estoque/ListEstoqueEstoqueUseCase";
import { EstoqueServiceImpl } from "../../services/estoque/EstoqueService";
import { EstoqueController } from "../controllers/EstoqueController";

export class EstoqueControllerFactory {
  private static createRepositories() {
    const estoqueRepository = new EstoqueRepository();
    const movimentoEstoqueRepository = new MovimentoEstoqueRepository();
    return {
      estoqueRepository,
      movimentoEstoqueRepository,
    };
  }

  private static createEstoqueUseCases(
    repos: ReturnType<typeof EstoqueControllerFactory.createRepositories>
  ) {
    return {
      list: new ListEstoqueUseCase(repos.estoqueRepository),
      adjust: new AdjustEstoqueUseCase(
        repos.estoqueRepository,
        repos.movimentoEstoqueRepository
      ),
    };
  }

  static create(): EstoqueController {
    const repositories = this.createRepositories();
    const estoqueUseCases = this.createEstoqueUseCases(repositories);

    const service = new EstoqueServiceImpl(
      estoqueUseCases.list,
      estoqueUseCases.adjust
    );

    return new EstoqueController(service);
  }
}
