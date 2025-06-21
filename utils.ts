import { ERROR_MESSAGES } from './constants';

import { ChatResponseBody, ErrorCode, ResponseStruct } from './types';

export const getChatResponseStruct = (error: ErrorCode, data: ChatResponseBody | null = null): ResponseStruct<ChatResponseBody> => {
  if (error === ErrorCode.SUCCESS) {
    return {
      error,
      error_message: ERROR_MESSAGES[error],
      data,
    };
  }

  return {
    error,
    error_message: ERROR_MESSAGES[error],
    data: null,
  };
};
