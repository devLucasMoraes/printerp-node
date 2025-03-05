import { NotFoundError } from "../../../shared/errors";
import { Equipamento } from "../../entities/Equipamento";
import { equipamentoRepository } from "../../repositories";

export const getEquipamentoUseCase = {
  async execute(id: number): Promise<Equipamento> {
    const equipamento = await equipamentoRepository.findOneBy({ id });

    if (!equipamento) {
      throw new NotFoundError("Equipamento não encontrado");
    }

    return equipamento;
  },
};
