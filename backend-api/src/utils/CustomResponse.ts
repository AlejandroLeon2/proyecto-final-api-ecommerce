import type { ICustomResponse } from "../interface/ICustomResponse.js";

export class CustomResponse {
  static success = <T>(data: T, message: string): ICustomResponse<T> => {
    return {
      success: true,
      message: message,
      data: data,
    };
  };

  static error = (code: string, message: string): ICustomResponse<null> => {
    return {
      success: false,
      message,
      error: {
        code,
        message,
      },
    };
  };
}
