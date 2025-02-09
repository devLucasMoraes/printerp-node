export function pageable(
  page?: string,
  size?: string,
  sort?: string | string[]
): { page?: number; size?: number; sort?: string[] } {
  const pageNumber = page ? parseInt(page) : 0;
  const pageSize = size ? parseInt(size) : 20;
  const sortArray = sort ? (Array.isArray(sort) ? sort : [sort]) : undefined;

  return { page: pageNumber, size: pageSize, sort: sortArray };
}
