# תערוכת הסריגה השנתית — אתר קהילתי

אתר בנוי עם [Astro](https://astro.build) ו-[Tailwind CSS](https://tailwindcss.com), עברית מלאה עם RTL.

---

## הפעלה מקומית

```bash
npm install
npm run dev
```

האתר יעלה על `http://localhost:4321`

---

## כיצד להחליף תמונות בדף הבית

1. הכנס/י תמונות חדשות לתיקייה `public/images/home/`
2. פתח/י את הקובץ `src/data/homeImages.js`
3. הוסף/י או הסר/י שורות ברשימה `homeImages` בהתאם לשמות הקבצים החדשים

**דוגמה:**
```js
export const homeImages = [
  '/images/home/home-01.jpg',
  '/images/home/my-new-photo.jpg', // <-- תמונה חדשה
];
```

---

## כיצד לעדכן את טקסט הפתיחה

ערוך/י ישירות את הקובץ `src/components/Hero.astro`:

- **כותרת** — שנה/י את המשתנה `heading`
- **גוף הטקסט** — ערוך/י את המערך `paragraphs`

---

## פריסה ל-Netlify

### אפשרות א׳ — ממשק Netlify
1. גרור/י את תיקיית הפרויקט לאתר [netlify.com/drop](https://netlify.com/drop)

### אפשרות ב׳ — חיבור Git
1. דחוף/י את הקוד ל-GitHub / GitLab
2. ב-Netlify: New site → Import from Git
3. Build command: `npm run build`
4. Publish directory: `dist`

קובץ `netlify.toml` כבר מוגדר בהתאם.

---

## מבנה הפרויקט

```
src/
  layouts/BaseLayout.astro      — מבנה HTML גלובלי, פונטים, סטיילים
  components/
    Nav.astro                   — ניווט עליון קבוע
    Footer.astro                — פוטר
    Hero.astro                  — סקשן הפתיחה עם הטקסט וה-CTA
    AnimatedImageWall.astro     — קיר התמונות המונפש
  data/homeImages.js            — רשימת תמונות לקיר
  pages/
    index.astro                 — דף הבית
    register.astro              — הרשמה (stub)
    donate.astro                — תרומה (stub)
    audio-guides.astro          — מדריכים קוליים (stub)
    gallery/2023.astro          — גלריה 2023 (stub)
    gallery/2024.astro          — גלריה 2024 (stub)
    gallery/2025.astro          — גלריה 2025 (stub)
public/
  images/home/                  — תמונות לדף הבית
  audio/                        — קבצי שמע (לעתיד)
```
