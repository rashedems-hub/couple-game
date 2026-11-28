# الاشتراكات داخل التطبيق (RevenueCat)

في نسخة التطبيق، الاشتراك يندفع عن طريق **App Store** و**Google Play**. هذا شرط آبل وجوجل لأي ميزة رقمية.
**RevenueCat** يربط الاشتراكات بحساب اللاعب في Firebase، ويفعّلها تلقائياً بدل التفعيل اليدوي.

## كيف يشتغل

1. اللاعب يسجّل دخول، ويفتح **إدارة التحديات**، ويختار الاشتراك الشهري أو السنوي.
2. الدفع يصير في نافذة المتجر نفسها، والتطبيق ما يشوف أي بيانات دفع.
3. RevenueCat يتأكد من الدفع، ويرسل حدث للـ webhook في `functions/index.js`.
4. الـ webhook يسأل RevenueCat عن حالة الاشتراك، ويكتب تاريخ انتهائه في `subscribers/{uid}/until`.
5. قواعد الأمان تسمح للمشترك يحفظ تحدياته الخاصة ما دام التاريخ هذا ما عدّى. نفس النظام اللي كان قبل.

الاشتراك من الموقع يبقى زي ما هو: المدير يفعّله يدوياً من شاشة المشتركين. والاشتراك اليدوي يبقى شغّال إذا كان أطول من اشتراك المتجر.

الميزة **مقفولة** لين تنحط مفاتيح RevenueCat العامة في `index.html` (`REVENUECAT_KEYS`). قبلها نسخة التطبيق تتصرف مثل الحين بالضبط.

## الإعداد (مرة وحدة)

### 1. اتفاقيات الدفع
- **App Store Connect ← Business:** وقّع **Paid Apps Agreement**، وعبّي الحساب البنكي والضرائب.
- **Play Console ← Settings ← Payments profile:** تأكد إن ملف الدفع (Merchant account) مربوط.
- سجّل في **App Store Small Business Program** عشان تكون عمولة آبل 15%.

### 2. المنتجات في المتاجر
استخدم نفس المعرّفات في المتجرين:

| المعرّف | المدة | سعر مقترح |
|---|---|---|
| `halalii_premium_monthly` | شهر | 14.99 ريال |
| `halalii_premium_yearly` | سنة | 99 ريال |

- **آبل:** صفحة التطبيق ← **Monetization ← Subscriptions**. سوّ مجموعة اسمها `Halalii Premium`، وأضف الاشتراكين فيها، والأسعار، والاسم والوصف بالعربي والإنجليزي، وصورة لشاشة الاشتراك للمراجعة. أول اشتراك لازم ينرسل للمراجعة مع إصدار جديد من التطبيق.
- **جوجل:** **Monetize ← Products ← Subscriptions**. سوّ اشتراكين بنفس المعرّفات، ولكل واحد **Base plan** يتجدد تلقائياً (`monthly` و`yearly`). Play Console يطلب أول شي بناء فيه صلاحية الفوترة، وأي بناء من هالنسخة فيه هالصلاحية.
- اختياري: تجربة مجانية 3 أو 7 أيام (Introductory offer في آبل، وFree trial offer في جوجل).

### 3. RevenueCat
1. سوّ حساب في **app.revenuecat.com** ومشروع اسمه `Halalii`.
2. **أضف تطبيق iOS:** Bundle ID هو `com.halalii.app`، وارفع **In-App Purchase Key** من App Store Connect (**Users and Access ← Integrations ← In-App Purchase**).
3. **أضف تطبيق Android:** Package name هو `com.halalii.app`، وارفع مفتاح **Service account** اللي عنده صلاحية على Play Console. RevenueCat يشرح الخطوات في صفحة الإضافة.
4. **Entitlements:** سوّ واحد معرّفه بالضبط `premium`، واربط فيه المنتجين من المتجرين.
5. **Offerings:** خلّ الـ offering الافتراضي `default`، وفيه باقتين: **Monthly** و**Annual**، وكل باقة فيها المنتج من المتجرين.
6. **Project settings ← API keys:** انسخ المفتاحين العامين وحطهم في `index.html`:
   ```js
   const REVENUECAT_KEYS = { ios: 'appl_...', android: 'goog_...' };
   ```
   هذي مفاتيح عامة، وعادي تكون في كود التطبيق. **لا تحط المفتاح السري (`sk_...`) في التطبيق أبداً.**

### 4. Firebase (الـ webhook)
1. حوّل مشروع Firebase لخطة **Blaze**. الـ webhook يشتغل ضمن الحد المجاني غالباً، بس الخطة لازمة لـ Cloud Functions.
2. **Google Cloud Console ← IAM ← Service accounts:** سوّ حساب خدمة بصلاحيات **Firebase Admin** و**Cloud Functions Admin** و**Secret Manager Admin** و**Service Account User**، ونزّل مفتاح JSON.
3. **في GitHub ← Settings ← Secrets and variables ← Actions** أضف:
   - `FIREBASE_SERVICE_ACCOUNT`: محتوى ملف JSON كامل
   - `REVENUECAT_SECRET_KEY`: من RevenueCat ← API keys ← **Secret API key (v1)**
   - `REVENUECAT_WEBHOOK_AUTH`: كلمة سر طويلة تختارها، مثل `Bearer ` وبعدها 40 حرف عشوائي
4. شغّل **Actions ← Firebase functions ← Run workflow**.
5. **RevenueCat ← Integrations ← Webhooks:**
   - **URL:** `https://us-central1-couple-game-95ed7.cloudfunctions.net/revenuecatWebhook`
   - **Authorization header value:** نفس قيمة `REVENUECAT_WEBHOOK_AUTH` بالضبط
   - اضغط **Send test event**، والمفروض يرجع `200`.

## التجربة قبل النشر
- **آبل:** ثبّت البناء من TestFlight. الدفع فيه تجريبي (Sandbox) وما يخصم فلوس، والاشتراك الشهري يتجدد كل 5 دقايق تقريباً.
- **جوجل:** أضف إيميلك في **Play Console ← Settings ← License testing**، وجرّب من نسخة الاختبار المغلق.
- بعد الدفع، تأكد إن `subscribers/{uid}` في Realtime Database صار فيه `until` و`source: "revenuecat"`، وإن "تحدياتي الخاصة" تنفتح وتحفظ.
- جرّب **استعادة المشتريات** بعد ما تحذف التطبيق وتثبّته من جديد.

## ملاحظات للمراجعة
- آبل تشترط زر **استعادة المشتريات**، وروابط **الشروط** و**الخصوصية** و**EULA**، وتوضيح التجديد التلقائي في شاشة الاشتراك. كلها موجودة.
- في ملاحظات المراجعة، اذكر إن الاشتراك في **إدارة التحديات**، وإنه يحتاج تسجيل دخول، وإن الحساب التجريبي يقدر يشترك بحساب Sandbox.
