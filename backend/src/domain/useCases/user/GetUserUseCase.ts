import { NotFoundError } from "../../../shared/errors";
import { User } from "../../entities/User";
import { userRepository } from "../../repositories";

export const getUserUseCase = {
  async execute(id: string): Promise<User> {
    const user = await userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }

    return user;
  },
};
