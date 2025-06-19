import dotenv from 'dotenv';
import { GoogleGenerativeAI, InlineDataPart } from '@google/generative-ai';
import express from 'express';
import multer from 'multer';
import fs from 'fs';

import {
  ENDPOINTS,
  GEMINI_MODEL,
  PORT,
  UPLOAD_DIR,
} from './constants';

dotenv.config();

const app = express();
app.use(express.json());

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error('Error: GEMINI_API_KEY environment variable is not set');
  console.error('Please create a .env file with your API key: GEMINI_API_KEY=your_api_key_here');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({
  model: GEMINI_MODEL,
  generationConfig: {
    temperature: 0.5,
  },
});

const upload = multer({ dest: UPLOAD_DIR });

app.post(ENDPOINTS.GENERATE_TEXT, async (req, res) => {
  const { prompt } = req.body;

  try {
    const { response } = await model.generateContent(prompt);

    res.json({ output: response.text() });
  } catch (error) {
    console.error(`[POST][${ENDPOINTS.GENERATE_TEXT}]:`, (error as Error).message || error);
    res.status(500).send((error as Error).message || error);
  }
});

const imageToGenerativePart = (filePath: string): InlineDataPart => ({
  inlineData: {
    data: fs.readFileSync(filePath).toString('base64'),
    mimeType: 'image/png',
  },
});

app.post(ENDPOINTS.GENERATE_FROM_IMAGE, upload.single('image'), async (req, res) => {
  const prompt = req.body.prompt || 'Describe the image in detail';
  const filePath = req.file?.path || '';
  const image = imageToGenerativePart(filePath);

  try {
    const { response } = await model.generateContent([prompt, image]);

    res.json({ output: response.text() });
  } catch (error) {
    console.error(`[POST][${ENDPOINTS.GENERATE_FROM_IMAGE}]:`, (error as Error).message || error);
    res.status(500).send((error as Error).message || error);
  } finally {
    fs.unlinkSync(filePath);
  }
});

app.post(ENDPOINTS.GENERATE_FROM_DOCUMENT, upload.single('document'), async (req, res) => {
  const prompt = req.body.prompt || 'summarize the document';
  const filePath = req.file?.path || '';
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');
  const mimeType = req.file?.mimetype || 'application/pdf';

  try {
    const part: InlineDataPart = {
      inlineData: {
        data: base64,
        mimeType,
      },
    };

    const { response } = await model.generateContent([prompt, part]);

    res.json({ output: response.text() });
  } catch (error) {
    console.error(`[POST][${ENDPOINTS.GENERATE_FROM_DOCUMENT}]:`, (error as Error).message || error);
    res.status(500).send((error as Error).message || error);
  } finally {
    fs.unlinkSync(filePath);
  }
});

app.post(ENDPOINTS.GENERATE_FROM_AUDIO, upload.single('audio'), async (req, res) => {
  const prompt = req.body.prompt || 'summarize the audio';
  const filePath = req.file?.path || '';
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');
  const mimeType = req.file?.mimetype || 'audio/mpeg';

  try {
    const part: InlineDataPart = {
      inlineData: {
        data: base64,
        mimeType,
      },
    };

    const { response } = await model.generateContent([prompt, part]);

    res.json({ output: response.text() });
  } catch (error) {
    console.error(`[POST][${ENDPOINTS.GENERATE_FROM_AUDIO}]:`, (error as Error).message || error);
    res.status(500).send((error as Error).message || error);
  } finally {
    fs.unlinkSync(filePath);
  }
});

app.listen(PORT, () => {
  console.log(`>>> Server is running on port ${PORT}`);
});
