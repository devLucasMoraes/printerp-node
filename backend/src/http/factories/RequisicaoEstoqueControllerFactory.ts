import { EstoqueRepository } from "../../domain/repositories/EstoqueRepository";
import { MovimentoEstoqueRepository } from "../../domain/repositories/MovimentoEstoqueRepository";
import { RequisicaoEstoqueRepository } from "../../domain/repositories/RequisicaoEstoqueRepository";
import { CreateRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/CreateRequisicaoEstoqueUseCase";
import { DeleteRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/DeleteRequisicaoEstoqueUseCase";
import { GetAllRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/GetAllRequisicaoEstoqueUseCase";
import { GetRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/GetRequisicaoEstoqueUseCase";
import { ListRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/ListRequisicaoEstoqueUseCase";
import { UpdateRequisicaoEstoqueUseCase } from "../../domain/useCases/requisicao-estoque/UpdateRequisicaoEstoqueUseCase";
import { RequisicaoEstoqueServiceImpl } from "../../services/requisicao-estoque/RequisicaoEstoqueServiceImpl";
import { RequisicaoEstoqueController } from "../controllers/RequisicaoEstoqueController";

export class RequisicaoEstoqueControllerFactory {
  // Repositórios
  private static repositories = {
    requisicaoEstoque: new RequisicaoEstoqueRepository(),
    estoque: new EstoqueRepository(),
    movimentoEstoque: new MovimentoEstoqueRepository(),
  };

  // Cria e retorna uma instância configurada do controller
  static create(): RequisicaoEstoqueController {
    // Use cases
    const useCases = {
      create: new CreateRequisicaoEstoqueUseCase(
        this.repositories.requisicaoEstoque,
        this.repositories.movimentoEstoque
      ),
      update: new UpdateRequisicaoEstoqueUseCase(
        this.repositories.requisicaoEstoque,
        this.repositories.estoque,
        this.repositories.movimentoEstoque
      ),
      delete: new DeleteRequisicaoEstoqueUseCase(
        this.repositories.requisicaoEstoque,
        this.repositories.movimentoEstoque
      ),
      get: new GetRequisicaoEstoqueUseCase(this.repositories.requisicaoEstoque),
      getAll: new GetAllRequisicaoEstoqueUseCase(
        this.repositories.requisicaoEstoque
      ),
      list: new ListRequisicaoEstoqueUseCase(
        this.repositories.requisicaoEstoque
      ),
    };

    // Service
    const service = new RequisicaoEstoqueServiceImpl(
      useCases.create,
      useCases.update,
      useCases.delete,
      useCases.get,
      useCases.getAll,
      useCases.list
    );

    // Controller
    return new RequisicaoEstoqueController(service);
  }
}
