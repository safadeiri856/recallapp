import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';

if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY مش موجود بملف .env — الأداة ما رح تشتغل بدونه.');
}

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function buildPrompt(text) {
  return `أنت مساعد تعليمي. اقرأ النص التالي وأنتج منه مادة مذاكرة مختصرة. أجب فقط بكائن JSON صالح بدون أي نص إضافي أو علامات markdown، بهذا الشكل بالضبط ولا تتجاوزه بالحجم:
{
  "title": "عنوان قصير للموضوع",
  "summary": "ملخص من 3-4 جمل بالعربية الفصحى البسيطة",
  "keyPoints": ["نقطة 1", "نقطة 2", "نقطة 3", "نقطة 4", "نقطة 5"],
  "flashcards": [{"front": "سؤال أو مصطلح قصير", "back": "جواب أو شرح قصير"}, ... (5 بطاقات بالضبط)],
  "quiz": [{"question": "نص السؤال", "options": ["خيار أ", "خيار ب", "خيار ج", "خيار د"], "correctIndex": 0, "explanation": "شرح مختصر جداً"}, ... (4 أسئلة بالضبط)]
}

مهم: خلي كل النصوص مختصرة ومباشرة عشان الجواب يبقى ضمن الحجم المسموح. لا تشرح، لا تعتذر، رجّع فقط كائن الـ JSON.

النص:
"""
${text}
"""`;
}

app.post('/api/study-kit', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length < 40) {
      return res.status(400).json({ error: 'النص قصير كتير، ابعت نص أطول.' });
    }

    const trimmed = text.trim().slice(0, 6000);

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(trimmed) }] }],
          generationConfig: { maxOutputTokens: 4000 }
        })
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error(data);
      return res.status(500).json({ error: data?.error?.message || 'صار خطأ بمزود الذكاء الاصطناعي.' });
    }

    const raw = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';

    if (!raw) {
      return res.status(500).json({ error: 'ما رجع النموذج جواب، جرب نص تاني أو أقصر.' });
    }

    res.json({ raw });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'صار خطأ بالسيرفر، جرب لاحقاً.' });
  }
});

app.listen(PORT, () => {
  console.log(`Recall شغال على http://localhost:${PORT}`);
});
