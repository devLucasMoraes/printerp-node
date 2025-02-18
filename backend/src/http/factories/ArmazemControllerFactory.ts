import { ArmazemRepository } from "../../domain/repositories/ArmazemRepository";
import { CreateArmazemUseCase } from "../../domain/useCases/armazem/CreateArmazemUseCase";
import { DeleteArmazemUseCase } from "../../domain/useCases/armazem/DeleteArmazemUseCase";
import { GetAllArmazemUseCase } from "../../domain/useCases/armazem/GetAllArmazemUseCase";
import { GetArmazemUseCase } from "../../domain/useCases/armazem/GetArmazemUseCase";
import { ListArmazemUseCase } from "../../domain/useCases/armazem/ListArmazemUseCase";
import { UpdateArmazemUseCase } from "../../domain/useCases/armazem/UpdateArmazemUseCase";
import { ArmazemServiceImpl } from "../../services/armazem/ArmazemServiceImpl";
import { ArmazemController } from "../controllers/ArmazemController";

export class ArmazemControllerFactory {
  // Repositórios
  private static repositories = {
    armazemEstoque: new ArmazemRepository(),
  };

  // Cria e retorna uma instância configurada do controller
  static create(): ArmazemController {
    // Use cases
    const useCases = {
      create: new CreateArmazemUseCase(this.repositories.armazemEstoque),
      update: new UpdateArmazemUseCase(this.repositories.armazemEstoque),
      delete: new DeleteArmazemUseCase(this.repositories.armazemEstoque),
      get: new GetArmazemUseCase(this.repositories.armazemEstoque),
      getAll: new GetAllArmazemUseCase(this.repositories.armazemEstoque),
      list: new ListArmazemUseCase(this.repositories.armazemEstoque),
    };

    // Service
    const service = new ArmazemServiceImpl(
      useCases.create,
      useCases.update,
      useCases.delete,
      useCases.get,
      useCases.getAll,
      useCases.list
    );

    // Controller
    return new ArmazemController(service);
  }
}
