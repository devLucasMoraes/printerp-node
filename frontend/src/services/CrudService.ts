import { Page, PageParams } from "../types";
import { api } from "./api/axios";

export interface CrudService<ID, T> {
  getAllPaginated(params?: PageParams): Promise<Page<T>>;
  getAll(): Promise<T[]>;
  getById(id: ID): Promise<T>;
  create(entity: Partial<T>): Promise<T>;
  update(id: ID, entity: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
}

export abstract class CrudService<ID, T> implements CrudService<ID, T> {
  constructor(protected endpoint: string) {}

  async getAllPaginated({ page = 0, size = 20, sort }: PageParams = {}) {
    const response = await api.get<Page<T>>(this.endpoint, {
      params: { page, size, sort },
    });
    return response.data;
  }

  async getAll(): Promise<T[]> {
    const response = await api.get<T[]>(`${this.endpoint}-all`);
    return response.data;
  }

  async getById(id: ID): Promise<T> {
    const response = await api.get<T>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(data: T): Promise<T> {
    const response = await api.post<T>(this.endpoint, data);
    return response.data;
  }

  async update(id: ID, data: Partial<T>): Promise<T> {
    const response = await api.put<T>(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async delete(id: ID): Promise<void> {
    const response = await api.delete<void>(`${this.endpoint}/${id}`);
    return response.data;
  }
}
