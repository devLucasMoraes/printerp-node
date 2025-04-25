import { RequestHandler } from "express";
import { User } from "../../domain/entities/User";
import { UserService } from "../../domain/services/UserService";
import { UserServiceImpl } from "../../services/user/UserServiceImpl";
import { pageable } from "../../shared/utils/pageable";
import { CreateUserDTO, UpdateUserDTO } from "../validators/user.schemas";

export class UserController {
  constructor(private readonly userService: UserService) {}

  list: RequestHandler = async (req, res) => {
    const users = await this.userService.list();

    const mappedUsers = users.map(this.toDTO);

    res.status(200).json(mappedUsers);
  };

  listPaginated: RequestHandler = async (req, res) => {
    const { page, size, sort } = req.query;
    // arrumar isso aqui depois para fazer a verificação de tipo com o zod
    const result = await this.userService.listPaginated(
      pageable(page as string, size as string, sort as string | string[])
    );

    const mappedResult = {
      ...result,
      content: result.content.map(this.toDTO),
    };

    res.status(200).json(mappedResult);
  };

  create: RequestHandler = async (req, res) => {
    const { email, name, password, role }: CreateUserDTO = req.body;

    const user = new User({
      email,
      name,
      password,
      role,
    });

    const newUser = await this.userService.create(user);

    const mappedUser = this.toDTO(newUser);

    res.status(201).json(mappedUser);
  };

  show: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const user = await this.userService.show(id);

    const mappedUser = this.toDTO(user);

    res.status(200).json(mappedUser);
  };

  update: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { email, name, password, role }: UpdateUserDTO = req.body;

    const user = new User({
      email,
      name,
      password,
      role,
    });

    const updatedUser = await this.userService.update(id, user);
    const mappedUser = this.toDTO(updatedUser);

    res.status(200).json(mappedUser);
  };

  delete: RequestHandler = async (req, res) => {
    const { id } = req.params;

    await this.userService.delete(id);

    res.status(204).send();
  };

  private toDTO(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profile: user.role,
    };
  }
}

export const userController = new UserController(new UserServiceImpl());
