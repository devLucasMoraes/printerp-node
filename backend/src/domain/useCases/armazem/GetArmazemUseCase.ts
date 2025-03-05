import { NotFoundError } from "../../../shared/errors";
import { Armazem } from "../../entities/Armazem";
import { armazemRepository } from "../../repositories";

export const getArmazemUseCase = {
  async execute(id: number): Promise<Armazem> {
    const armazem = await armazemRepository.findOneWithRelations(id);

    if (!armazem) {
      throw new NotFoundError("Armazém não encontrado");
    }

    return armazem;
  },
};
