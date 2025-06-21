import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

import {
  ChatRequestBody,
  ChatResponseBody,
  ErrorCode,
  PingResponseBody,
  ResponseStruct,
} from './types';

import {
  ENDPOINTS,
  ERROR_MESSAGES,
  GEMINI_MODEL,
  PORT,
} from './constants';
import { getChatResponseStruct } from './utils';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error('Error: GEMINI_API_KEY environment variable is not set');
  console.error('Please create a .env file with your API key: GEMINI_API_KEY=your_api_key_here');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({
  model: GEMINI_MODEL,
  // generationConfig: {
  //   temperature: 0.5,
  // },
});

app.get(ENDPOINTS.PING, (_req: Request, res: Response<PingResponseBody>) => {
  res.json({ message: 'pong' });
});

app.post(ENDPOINTS.CHAT, async (req: Request<ChatRequestBody>, res: Response<ResponseStruct<ChatResponseBody>>) => {
  const { message } = req.body;

  try {
    if (typeof message !== 'string') {
      if (typeof message === 'undefined') {
        res.json(getChatResponseStruct(ErrorCode.NO_MESSAGE));
      } else {
        res.json(getChatResponseStruct(ErrorCode.INVALID_MESSAGE));
      }
      return
    }

    const { response } = await model.generateContent(message);
    res.json(getChatResponseStruct(ErrorCode.SUCCESS, { answer: response.text() }));
  } catch (error) {
    const e = error as Error;
    console.error(`[API][POST][${ENDPOINTS.CHAT}]`, e.message || e);
    res.json(getChatResponseStruct(ErrorCode.UNKNOWN_ERROR));
  }
});

app.listen(PORT, () => {
  console.log(`>>> Server is running on port ${PORT}`);
});
