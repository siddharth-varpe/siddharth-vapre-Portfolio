export type ActionSuccess<T = void> = {
  success: true;
  data: T;
};

export type ActionFailure = {
  success: false;
  error: string;
  code?: string;
  fieldErrors?: Record<string, string[]>;
};

export type ActionResult<T = void> = ActionSuccess<T> | ActionFailure;

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
