import { NotFoundError } from "../../../shared/errors";
import { Requisitante } from "../../entities/Requisitante";
import { requisitanteRepository } from "../../repositories";

export const getRequisitanteUseCase = {
  async execute(id: number): Promise<Requisitante> {
    const requisitante = await requisitanteRepository.findOneBy({ id });

    if (!requisitante) {
      throw new NotFoundError("Requisitante não encontrado");
    }

    return requisitante;
  },
};
