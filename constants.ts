export const PORT = 3000;

export const ENDPOINTS: Record<string, string> = {
  GENERATE_TEXT: '/generate-text',
  GENERATE_FROM_IMAGE: '/generate-from-image',
  GENERATE_FROM_AUDIO: '/generate-from-audio',
  GENERATE_FROM_DOCUMENT: '/generate-from-document',
};

export const UPLOAD_DIR = 'uploads/';

export const GEMINI_MODEL = 'models/gemini-2.0-flash';
// export const GEMINI_MODEL = 'models/gemini-2.0-flash-lite';
