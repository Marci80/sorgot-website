# חיבור טופס ההרשמה ל-Google Sheet (דרך Apps Script)

טופס ההרשמה שולח את הנתונים ל-Formspree (מייל התראה + הודעת אישור אוטומטית),
**וגם** מוסיף כל הרשמה כשורה בגיליון Google Sheets — בחינם, בלי לגעת ב-Formspree.

**הסטטוס: פעיל.** ההגדרה כבר בוצעה. המסמך הזה מתעד איך זה בנוי ומה לעשות אם צריך לתחזק.

---

## מה מחובר למה

| רכיב | פרטים |
|---|---|
| גיליון היעד | `נרשמות לתערוכה 2026` — ID: `1Yop9osJ72FQuC6kfzhjewBWcBAFeGch7H6-CVTG4gPI` |
| לשונית | `הרשמות` (נוצרת אוטומטית אם חסרה; שורת כותרת נכתבת פעם אחת) |
| סקריפט | Apps Script עצמאי בחשבון marcitavor@gmail.com — הקוד ב-[`register-to-sheet.gs`](register-to-sheet.gs) |
| כתובת ה-Web App | `https://script.google.com/macros/s/AKfycbwbyVrU9hXvByFY3VSaCtTof3oaGUL7146sa0ZhDRj4FnjIeTYhNh5E-ie2ezkiDsWLoQ/exec` |
| מחובר לאתר ב- | [`../src/pages/register.astro`](../src/pages/register.astro) — הקבוע `SHEETS_ENDPOINT` |

עמודות בגיליון: `תאריך · שם מלא · טלפון · אימייל · יישוב · הערות`.

---

## איך זה עובד

1. המבקרת שולחת את הטופס → הדפדפן שולח ל-Formspree.
2. רק אחרי ש-Formspree מאשר, הדפדפן שולח POST נוסף (best-effort) לכתובת ה-Web App.
3. הסקריפט (`doPost`) פותח את הגיליון לפי ה-ID ומוסיף שורה בלשונית `הרשמות`.
4. אם שלב 2–3 נכשל מסיבה כלשהי — הטופס והמייל ממשיכים לעבוד כרגיל. הגיליון הוא "בונוס".

---

## תחזוקה

### שיניתי את `register-to-sheet.gs` — איך מעדכנים?
1. פותחים את הסקריפט: <https://script.google.com/home> → הפרויקט הרלוונטי.
2. מדביקים את הקוד המעודכן, שומרים (Ctrl+S).
3. **Deploy → Manage deployments → עיפרון (עריכה) → Version: New version → Deploy.**
   ה-URL **לא משתנה**, אז אין צורך לגעת שוב באתר.

### שינוי שמות השדות בטופס
אם משנים `name` / `phone` / `email` / `city` / `notes` ב-`register.astro`,
צריך לעדכן במקביל את המערך `FIELDS` (ואת `HEADERS`) בסקריפט ולפרסם גרסה חדשה.

### רוצים גיליון אחר
מעדכנים את `SHEET_ID` בראש הסקריפט ומפרסמים גרסה חדשה.

---

## פתרון תקלות

בדיקה מהירה שהסקריפט חי: פותחים את כתובת ה-Web App בדפדפן —
אמור להופיע `{"ok":true,"message":"register-to-sheet is live"}`.

| תסמין | סיבה סבירה |
|---|---|
| שורה לא נוספת | ההרשאה של ה-Web App אינה "כולם" (Anyone), או שפורסמה גרסה חדשה עם URL אחר שלא עודכן ב-`register.astro` |
| נוספת שורה חלקית/ריקה | שמות השדות בטופס השתנו ולא עודכן `FIELDS` בסקריפט |
| עמודות בסדר שגוי | מוחקים את שורת הכותרת בלשונית `הרשמות`; הסקריפט יכתוב אותה מחדש בהגשה הבאה |
| `Google hasn't verified this app` בעת פרסום | תקין — זה הסקריפט הפרטי שלך. Advanced → Go to project → Allow |
