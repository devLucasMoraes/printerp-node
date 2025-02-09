import { User } from "../../domain/entities/User";
import { userRepository } from "../../domain/repositories";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { UserService } from "../../domain/services/UserService";
import { BadRequestError, NotFoundError } from "../../shared/errors";

export class UserServiceImpl implements UserService {
  async findByEmail(email: string): Promise<User> {
    const user = await userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async listPaginated(pageRequest?: PageRequest): Promise<Page<User>> {
    return await userRepository.findAllPaginated(pageRequest);
  }

  async list(): Promise<User[]> {
    return await userRepository.find();
  }

  async show(id: string): Promise<User> {
    const userExists = await userRepository.findOne({
      where: { id },
    });

    if (!userExists) {
      throw new NotFoundError("User not found");
    }

    return userExists;
  }

  async create(entity: User): Promise<User> {
    const { email } = entity;

    const userExists = await userRepository.findOneBy({ email });

    if (userExists) {
      throw new BadRequestError("Email already exists");
    }

    await entity.hashPassword();

    const newUser = userRepository.create(entity);

    return await userRepository.save(newUser);
  }

  async update(id: string, entity: User): Promise<User> {
    const userExists = await userRepository.findOneBy({ id });

    if (!userExists) {
      throw new NotFoundError("User not found");
    }

    await entity.hashPassword();

    userRepository.merge(userExists, entity);

    return await userRepository.save(userExists);
  }

  async delete(id: string): Promise<void> {
    const userExists = await userRepository.findOneBy({ id });

    if (!userExists) {
      throw new NotFoundError("User not found");
    }

    await userRepository.softDelete(id);
    return Promise.resolve();
  }
}
