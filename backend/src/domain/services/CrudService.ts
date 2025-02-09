import { Page, PageRequest } from "../repositories/BaseRepository";

export interface CrudService<ID, T> {
  listPaginated(pageRequest?: PageRequest): Promise<Page<T>>;
  list(): Promise<T[]>;
  show(id: ID): Promise<T>;
  create(entity: T): Promise<T>;
  update(id: ID, entity: T): Promise<T>;
  delete(id: ID): Promise<void>;
}
