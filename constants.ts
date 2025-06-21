import { ErrorCode } from './types';

export const PORT = process.env.PORT || 3000;
export const GEMINI_MODEL = 'models/gemini-2.0-flash';

export const ENDPOINTS: Record<string, string> = {
  CHAT: '/api/chat',
  PING: '/api/ping',
};

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.SUCCESS]: '',
  [ErrorCode.NO_MESSAGE]: 'Message is required',
  [ErrorCode.INVALID_MESSAGE]: 'Message must be a string',
  [ErrorCode.UNKNOWN_ERROR]: 'Unknown error',
};
