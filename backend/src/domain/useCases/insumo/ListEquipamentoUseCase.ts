import { Equipamento } from "../../entities/Equipamento";
import { Page, PageRequest } from "../../repositories/BaseRepository";
import { EquipamentoRepository } from "../../repositories/EquipamentoRepository";

export class ListEquipamentoUseCase {
  constructor(private readonly equipamentoRepository: EquipamentoRepository) {}

  async execute(pageRequest?: PageRequest): Promise<Page<Equipamento>> {
    return await this.equipamentoRepository.findAllPaginated(pageRequest);
  }
}
