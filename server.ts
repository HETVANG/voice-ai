import express from 'express';
import path from 'path';
import multer from 'multer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { runScamShieldPipeline } from './src/lib/ai/pipeline';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Setup in-memory audio file storage via multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024 // 25 MB max audio size
  }
});

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Health and provider status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    sarvamConfigured: Boolean(process.env.SARVAM_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Audio upload and analysis endpoint
app.post('/api/analyze-audio', upload.single('audio'), async (req, res) => {
  try {
    const file = req.file;
    const language = (req.body.language as string) || 'gu';

    if (!file && !req.body.audioBase64) {
      return res.status(400).json({
        error: 'No audio file or audio data was provided.'
      });
    }

    let audioBuffer: Buffer;
    let mimeType: string;

    if (file) {
      audioBuffer = file.buffer;
      mimeType = file.mimetype || 'audio/wav';
    } else {
      const base64Data = req.body.audioBase64.replace(/^data:audio\/\w+;base64,/, '');
      audioBuffer = Buffer.from(base64Data, 'base64');
      mimeType = req.body.mimeType || 'audio/wav';
    }

    const assessment = await runScamShieldPipeline({
      audioBuffer,
      mimeType,
      language
    });

    return res.json(assessment);
  } catch (error) {
    console.error('API Error in /api/analyze-audio:', error);
    return res.status(500).json({
      riskLevel: 'Unknown',
      score: 0,
      warningSigns: ['Server processing error occurred during audio analysis.'],
      evidence: [],
      recommendedAction: 'Retry with a clearer audio recording or test with sample transcripts.',
      language: (req.body.language as string) || 'Gujarati',
      analysisSource: 'unknown',
      transcript: '',
      category: 'Server Error',
      summary: 'Internal error while processing audio stream.',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Direct transcript / text analysis endpoint
app.post('/api/analyze-text', async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text transcript is required.' });
    }

    const assessment = await runScamShieldPipeline({
      transcriptText: text,
      language: language || 'gu'
    });

    return res.json(assessment);
  } catch (error) {
    console.error('API Error in /api/analyze-text:', error);
    return res.status(500).json({
      riskLevel: 'Unknown',
      score: 0,
      warningSigns: ['Server error while evaluating transcript.'],
      evidence: [],
      recommendedAction: 'Verify input and try again.',
      language: (req.body.language as string) || 'Gujarati',
      analysisSource: 'unknown',
      transcript: req.body.text || '',
      summary: 'Error during transcript analysis.',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Mount Vite or serve static files
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Scam Call Shield server running on port ${port} (mode: ${isProduction ? 'prod' : 'dev'})`);
  });
}

startServer();
