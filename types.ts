export enum ErrorCode {
  SUCCESS = 0,
  NO_MESSAGE = 1,
  INVALID_MESSAGE = 2,
  UNKNOWN_ERROR = 9,
}

export interface ResponseStruct<T> {
  error: ErrorCode;
  error_message: string;
  data: T | null;
}

export interface PingResponseBody {
  message: string;
}

export interface ChatRequestBody {
  message: string;
}

export interface ChatResponseBody {
  answer: string;
}