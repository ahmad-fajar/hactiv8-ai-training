export const PORT = process.env.PORT || 3000;
export const GEMINI_MODEL = 'models/gemini-2.0-flash';

export const ENDPOINTS: Record<string, string> = {
  CHAT: '/api/chat',
  PING: '/api/ping',
};
