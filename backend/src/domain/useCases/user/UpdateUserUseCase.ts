import { EntityManager } from "typeorm";
import { UpdateUserDTO } from "../../../http/validators/user.schemas";
import { BadRequestError, NotFoundError } from "../../../shared/errors";
import { User } from "../../entities/User";
import { userRepository } from "../../repositories";

export const updateUserUseCase = {
  async execute(id: string, dto: UpdateUserDTO): Promise<User> {
    return await userRepository.manager.transaction(async (manager) => {
      const userToUpdate = await findUserToUpdate(id, manager);
      await validate(id, dto, manager);
      const user = await update(userToUpdate, dto, manager);
      return user;
    });
  },
};

async function findUserToUpdate(
  id: string,
  manager: EntityManager
): Promise<User> {
  const user = await manager.findOne(User, {
    where: { id },
  });

  if (!user) {
    throw new NotFoundError("Usuário nao encontrado");
  }

  return user;
}

async function validate(
  id: string,
  dto: UpdateUserDTO,
  manager: EntityManager
): Promise<void> {
  const user = await manager.getRepository(User).findOne({
    where: { name: dto.name },
    withDeleted: true,
  });

  if (id !== dto.id) {
    throw new BadRequestError("Id do usuário não pode ser alterado");
  }

  if (user && user.ativo === true && user.id !== dto.id) {
    throw new BadRequestError(`Usuário "${user.name}" já cadastrado`);
  }

  if (user && user.ativo === false) {
    throw new BadRequestError(`Usuário "${user.name}" desativado`);
  }
}

async function update(
  userToUpdate: User,
  dto: UpdateUserDTO,
  manager: EntityManager
): Promise<User> {
  const userDTO = userRepository.create({
    id: dto.id,
    name: dto.name,
    email: dto.email,
    password: dto.password,
    role: dto.role,
    userId: dto.userId,
  });

  const user = userRepository.merge(userToUpdate, userDTO);

  return await manager.save(User, user);
}
