export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface PageMeta {
  total: number;
  limit: number;
  offset: number;
}

export interface ApiSuccessPaged<T> {
  success: true;
  data: T[];
  meta: PageMeta;
}

export interface ZodIssueLike {
  path: (string | number)[];
  message: string;
  code?: string;
}

export interface ApiFailure {
  success: false;
  error: {
    message: string;
    details?: ZodIssueLike[] | unknown;
  };
}

export interface Paginated<T> {
  items: T[];
  meta: PageMeta;
}
