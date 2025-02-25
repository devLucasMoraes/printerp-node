import { Page, PageRequest } from "../repositories/BaseRepository";

export interface CrudService<ID, T, CreateDTO, UpdateDTO> {
  listPaginated(pageRequest?: PageRequest): Promise<Page<T>>;
  list(): Promise<T[]>;
  show(id: ID): Promise<T>;
  create(dto: CreateDTO): Promise<T>;
  update(id: ID, dto: UpdateDTO): Promise<T>;
  delete(id: ID, userID?: string): Promise<void>;
}
