import { User } from "../../entities/User";
import { userRepository } from "../../repositories";

export const getAllUserUseCase = {
  async execute(): Promise<User[]> {
    return await userRepository.find();
  },
};
