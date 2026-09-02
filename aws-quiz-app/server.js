const express = require('express');
const multer = require('multer');
const fs = require('fs/promises');
const path = require('path');
const { buildModuleFromInput } = require('./book_to_questions');
const config = require('./js/config.js');

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({
    storage: multer.diskStorage({
        destination: async (_req, _file, cb) => {
            const uploadDir = path.join(__dirname, 'documents');
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        },
        filename: (_req, file, cb) => {
            const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
            cb(null, `${Date.now()}-${safeName}`);
        }
    }),
    limits: { fileSize: 25 * 1024 * 1024 }
});

app.use(express.static(__dirname));

app.post('/api/upload-module', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const apiKey = process.env.GEMINI_API_KEY || config.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            return res.status(400).json({ error: 'Missing Gemini API key. Set GEMINI_API_KEY or update js/config.js.' });
        }

        const result = await buildModuleFromInput({
            inputPath: req.file.path,
            title: req.body.title || path.basename(req.file.originalname, path.extname(req.file.originalname)),
            questions: Number(req.body.questions) || 10,
            maxChars: 60000,
            requestTimeoutMs: 120000,
            retries: 3,
            apiKey
        });

        await fs.unlink(req.file.path).catch(() => {});
        return res.json(result);
    } catch (error) {
        console.error('Upload conversion failed:', error);
        return res.status(500).json({ error: error.message || 'Conversion failed.' });
    }
});

app.get('/health', (_req, res) => {
    res.json({ ok: true });
});

app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Edu-Arg server running at http://localhost:${port}`);
});
