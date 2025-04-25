import { EntityManager } from "typeorm";
import { CreateUserDTO } from "../../../http/validators/user.schemas";
import { BadRequestError } from "../../../shared/errors";
import { User } from "../../entities/User";
import { userRepository } from "../../repositories";

export const createUserUseCase = {
  async execute(dto: CreateUserDTO): Promise<User> {
    return await userRepository.manager.transaction(async (manager) => {
      await validate(dto, manager);
      const user = await createUser(dto, manager);
      return user;
    });
  },
};

async function validate(
  dto: CreateUserDTO,
  manager: EntityManager
): Promise<void> {
  const user = await manager.getRepository(User).findOne({
    where: { name: dto.name },
    withDeleted: true,
  });

  if (user && user.ativo === true) {
    throw new BadRequestError(`Usuário "${user.name}" já cadastrado`);
  }

  if (user && user.ativo === false) {
    throw new BadRequestError(`Usuário "${user.name}" desativado`);
  }
}

async function createUser(
  dto: CreateUserDTO,
  manager: EntityManager
): Promise<User> {
  const userToCreate = userRepository.create({
    name: dto.name,
    email: dto.email,
    password: dto.password,
    role: dto.role,
    userId: dto.userId,
  });

  userToCreate.hashPassword();

  return await manager.save(User, userToCreate);
}
