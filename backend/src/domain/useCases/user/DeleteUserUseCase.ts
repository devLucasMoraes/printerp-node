import { EntityManager } from "typeorm";
import { NotFoundError } from "../../../shared/errors";
import { User } from "../../entities/User";
import { userRepository } from "../../repositories";

export const deleteUserUseCase = {
  async execute(id: string, userId: string): Promise<void> {
    return await userRepository.manager.transaction(async (manager) => {
      const user = await findUser(id, manager);
      await disable(user, manager, userId);
    });
  },
};

async function findUser(id: string, manager: EntityManager): Promise<User> {
  const user = await manager.getRepository(User).findOneBy({ id });

  if (!user) {
    throw new NotFoundError("Usuário não encontrado");
  }

  return user;
}

async function disable(
  user: User,
  manager: EntityManager,
  userId: string
): Promise<void> {
  user.ativo = false;
  user.userId = userId;

  await manager.save(User, user);

  await manager.softDelete(User, user.id);
}
