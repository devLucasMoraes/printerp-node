import { User } from "../../entities/User";
import { userRepository } from "../../repositories";
import { Page, PageRequest } from "../../repositories/BaseRepository";

export const listUserUseCase = {
  async execute(pageRequest?: PageRequest): Promise<Page<User>> {
    return await userRepository.findAllPaginated(pageRequest);
  },
};
