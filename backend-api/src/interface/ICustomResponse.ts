export interface IResponseError {
  code: string;
  message: string;
}

export interface ICustomResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: IResponseError;
}
