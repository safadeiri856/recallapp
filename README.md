# Recall — مشروع مستقل جاهز للنشر (يستخدم Google Gemini، مجاني بدون بطاقة)

أداة بتحول أي نص (محاضرة، فصل كتاب، PDF) لملخص + بطاقات مراجعة + كويز تفاعلي، بالذكاء الاصطناعي فعلياً.

## بنية المشروع

```
recall-app/
  server.js          ← سيرفر Express، فيه مفتاح الـ API محمي
  public/index.html  ← الواجهة كاملة
  package.json
  .env.example
```

## خطوة لازمة قبل أي شي: مفتاح Gemini (مجاني، دقيقتين)

1. روح على **aistudio.google.com** وسجل دخول بحساب Google عادي (نفس إيميلك).
2. دوس **"Get API key"** (عادة فوق يمين الشاشة أو بالقائمة الجانبية).
3. دوس **"Create API key"** — بيطلب منك تختار مشروع Google Cloud، اختار "Create new project" إذا ما عندك واحد.
4. المفتاح بيبان فوراً، شكله شي متل `AIzaSy...`. انسخه.
5. **بدون بطاقة، بدون فوترة، مجاني بشكل دائم** (بحدود استخدام معقولة يومياً).

## 1) تشغيله عندك محلياً

```bash
cd recall-app
npm install
cp .env.example .env
# افتح .env وحط مفتاح Gemini مطرح your_api_key_here
npm start
```

افتح المتصفح على: `http://localhost:3000`

## 2) نشره على الإنترنت برابط خاص (Render — نفس طريقة مشروع crud عندك)

1. ادفع المشروع لـ GitHub.
2. روح على [render.com](https://render.com) → New → Web Service → اربطه بالـ repo.
3. الإعدادات:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. تحت "Environment Variables" ضيف:
   - `GEMINI_API_KEY` = مفتاحك
5. Deploy.

بعد شوي دقايق رح ياخد رابط شكله متل:
`https://recall-xxxx.onrender.com`

## ملاحظات

- الجلسات السابقة محفوظة بمتصفح المستخدم (`localStorage`).
- الخطة المجانية بـ Render بتنام بعد فترة عدم استخدام، وبتاخد كم ثانية تصحى.
- `.env` موجود بـ `.gitignore` عشان ما ترفع مفتاحك لـ GitHub بالغلط.
