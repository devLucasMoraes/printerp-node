import { EstoqueRepository } from "../../domain/repositories/EstoqueRepository";
import { MovimentoEstoqueRepository } from "../../domain/repositories/MovimentoEstoqueRepository";
import { RequisicaoEstoqueRepository } from "../../domain/repositories/RequisicaoEstoqueRepository";
import { InicializarEstoqueUseCase } from "../../domain/useCases/estoque/InicializarEstoqueUseCase";
import { RegistrarEntradaEstoqueUseCase } from "../../domain/useCases/estoque/RegistrarEntradaEstoqueUseCase";
import { RegistrarSaidaEstoqueUseCase } from "../../domain/useCases/estoque/RegistrarSaidaEstoqueUseCase";
import { CreateRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/CreateRequisicaoEstoqueUseCase";
import { DeleteRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/DeleteRequisicaoEstoqueUseCase";
import { GetAllRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/GetAllRequisicaoEstoqueUseCase";
import { GetRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/GetRequisicaoEstoqueUseCase";
import { ListRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/ListRequisicaoEstoqueUseCase";
import { UpdateRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/UpdateRequisicaoEstoqueUseCase";
import { RequisicaoEstoqueServiceImpl } from "../../services/requisicao-estoque/RequisicaoEstoqueServiceImpl";
import { RequisicaoEstoqueController } from "../controllers/RequisicaoEstoqueController";

export class RequisicaoEstoqueControllerFactory {
  private static createRepositories() {
    const estoqueRepository = new EstoqueRepository();
    const movimentoEstoqueRepository = new MovimentoEstoqueRepository();
    const requisicaoEstoqueRepository = new RequisicaoEstoqueRepository();

    return {
      estoqueRepository,
      movimentoEstoqueRepository,
      requisicaoEstoqueRepository,
    };
  }

  private static createEstoqueUseCases(
    repos: ReturnType<
      typeof RequisicaoEstoqueControllerFactory.createRepositories
    >
  ) {
    const inicializarEstoque = new InicializarEstoqueUseCase(
      repos.estoqueRepository
    );

    return {
      inicializarEstoque,
      registrarEntrada: new RegistrarEntradaEstoqueUseCase(
        repos.movimentoEstoqueRepository,
        inicializarEstoque
      ),
      registrarSaida: new RegistrarSaidaEstoqueUseCase(
        repos.movimentoEstoqueRepository,
        inicializarEstoque
      ),
    };
  }

  private static createRequisicaoUseCases(
    repos: ReturnType<
      typeof RequisicaoEstoqueControllerFactory.createRepositories
    >,
    estoqueUseCases: ReturnType<
      typeof RequisicaoEstoqueControllerFactory.createEstoqueUseCases
    >
  ) {
    return {
      create: new CreateRequisicaoEstoqueUseCase(
        repos.requisicaoEstoqueRepository,
        estoqueUseCases.registrarSaida
      ),
      update: new UpdateRequisicaoEstoqueUseCase(
        repos.requisicaoEstoqueRepository,
        estoqueUseCases.registrarEntrada,
        estoqueUseCases.registrarSaida
      ),
      delete: new DeleteRequisicaoEstoqueUseCase(
        repos.requisicaoEstoqueRepository,
        estoqueUseCases.registrarEntrada
      ),
      get: new GetRequisicaoEstoqueUseCase(repos.requisicaoEstoqueRepository),
      getAll: new GetAllRequisicaoEstoqueUseCase(
        repos.requisicaoEstoqueRepository
      ),
      list: new ListRequisicaoEstoqueUseCase(repos.requisicaoEstoqueRepository),
    };
  }

  static create(): RequisicaoEstoqueController {
    const repositories = this.createRepositories();
    const estoqueUseCases = this.createEstoqueUseCases(repositories);
    const requisicaoUseCases = this.createRequisicaoUseCases(
      repositories,
      estoqueUseCases
    );

    const service = new RequisicaoEstoqueServiceImpl(
      requisicaoUseCases.create,
      requisicaoUseCases.update,
      requisicaoUseCases.delete,
      requisicaoUseCases.get,
      requisicaoUseCases.getAll,
      requisicaoUseCases.list
    );

    return new RequisicaoEstoqueController(service);
  }
}
