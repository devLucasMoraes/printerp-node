import { NotFoundError } from "../../../shared/errors";
import { Setor } from "../../entities/Setor";
import { setorRepository } from "../../repositories";

export const getSetorUseCase = {
  async execute(id: number): Promise<Setor> {
    const setor = await setorRepository.findOneBy({ id });

    if (!setor) {
      throw new NotFoundError("Setor não encontrado");
    }

    return setor;
  },
};
