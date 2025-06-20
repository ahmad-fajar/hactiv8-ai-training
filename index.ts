import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { ENDPOINTS, GEMINI_MODEL, PORT } from './constants';

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

app.get(ENDPOINTS.PING, (_req, res) => {
  res.json({ message: 'pong' });
});

app.post(ENDPOINTS.CHAT, async (req, res) => {
  const { message } = req.body;

  try {
    const { response } = await model.generateContent(message);
    res.json({ answer: response.text() });
  } catch (error) {
    const e = error as Error;
    console.error(`[API][POST][${ENDPOINTS.CHAT}]`, e.message || e);
    res.json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`>>> Server is running on port ${PORT}`);
});
