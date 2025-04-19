import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from "typeorm";

// Tipos para ordenação, paginação e resposta de página
export type Sort = {
  empty: boolean; // Indica se a ordenação está vazia
  sorted: boolean; // Indica se a ordenação está aplicada
  unsorted: boolean; // Indica se a ordenação não está aplicada
};

export type Pageable = {
  sort: Sort; // Informações sobre a ordenação
  offset: number; // Deslocamento dos resultados
  pageNumber: number; // Número da página atual
  pageSize: number; // Tamanho da página
  paged: boolean; // Indica se a paginação está ativada
  unpaged: boolean; // Indica se a paginação não está ativada
};

export type Page<T> = {
  content: T[]; // Conteúdo da página
  pageable: Pageable; // Informações sobre a paginação
  last: boolean; // Indica se é a última página
  totalPages: number; // Número total de páginas
  totalElements: number; // Número total de elementos
  size: number; // Tamanho da página
  number: number; // Número da página atual
  sort: Sort; // Informações sobre a ordenação
  first: boolean; // Indica se é a primeira página
  numberOfElements: number; // Número de elementos na página atual
  empty: boolean; // Indica se a página está vazia
};

export interface PageRequest {
  page?: number; // Número da página solicitada
  size?: number; // Tamanho da página solicitada
  sort?: string | string[]; // Critérios de ordenação
  filters?: Record<string, any>; // Filtros a serem aplicados
}

export abstract class BaseRepository<
  T extends ObjectLiteral
> extends Repository<T> {
  protected buildPaginationOptions(pageRequest: PageRequest = {}) {
    const page = Number(pageRequest.page) || 0;
    const size = Number(pageRequest.size) || 20;

    const order: FindOptionsOrder<T> = {}; // Inicializa a ordem de ordenação
    const sortFields = pageRequest.sort
      ? Array.isArray(pageRequest.sort)
        ? pageRequest.sort
        : [pageRequest.sort]
      : []; // Converte sort para um array de strings

    // Preenche o objeto de ordenação com os campos e direções
    sortFields.forEach((sortField) => {
      const [field, direction] = sortField.split(",");
      Object.assign(order, {
        [field]: (direction || "ASC").toUpperCase() as "ASC" | "DESC",
      });
    });

    return { page, size, order, hasSort: sortFields.length > 0 }; // Retorna as opções de paginação
  }

  async paginate(
    pageRequest: PageRequest = {},
    where?: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>
  ): Promise<Page<T>> {
    const { page, size, order, hasSort } =
      this.buildPaginationOptions(pageRequest);

    const findOptions = {
      where,
      order,
      skip: page * size,
      take: size,
      relations,
    };

    const [content, totalElements] = await this.findAndCount(findOptions);

    console.log("\n where", where);

    const sort: Sort = {
      empty: !hasSort,
      sorted: hasSort,
      unsorted: !hasSort,
    };

    const totalPages = Math.ceil(totalElements / size);
    const numberOfElements = content.length;

    return {
      content,
      pageable: {
        sort,
        offset: page * size,
        pageNumber: page,
        pageSize: size,
        paged: true,
        unpaged: false,
      },
      last: page >= totalPages - 1,
      totalPages,
      totalElements,
      size,
      number: page,
      sort,
      first: page === 0,
      numberOfElements,
      empty: numberOfElements === 0,
    };
  }
}
