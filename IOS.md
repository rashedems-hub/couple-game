# تطبيق الآيفون — لعبة الأزواج

اللعبة نفسها (`index.html`) تبقى في جذر المشروع وتشتغل كـ PWA مثل ما هي.
مجلد `ios/` هو مشروع Xcode يغلّف نفس اللعبة كتطبيق آيفون حقيقي باستخدام
[Capacitor](https://capacitorjs.com).

## المتطلبات

- جهاز **Mac** عليه **Xcode 16** أو أحدث (ما ينفع تبني تطبيق آيفون بدون ماك)
- **Node.js 22** أو أحدث
- حساب [Apple Developer](https://developer.apple.com/programs/) (‏99$ بالسنة) — مطلوب للنشر في App Store.
  للتجربة على جوالك بس يكفي Apple ID مجاني.

## التشغيل على الآيفون

```bash
npm install
npm run ios:sync    # ينسخ اللعبة لمجلد www/ ثم لمشروع iOS
npm run ios:open    # يفتح المشروع في Xcode
```

في Xcode:

1. اختر الـ target ‏**App** ← تبويب **Signing & Capabilities** ← اختر الـ **Team** حقك.
2. لو طلع خطأ إن الـ Bundle ID مستخدم، غيّر `com.rashed.couplegame` لشي خاص فيك
   (وغيّره بعدين في `capacitor.config.json` بعد).
3. وصّل الآيفون بالكيبل (أو اختر Simulator) واضغط ▶︎ **Run**.

> كل ما تعدّل `index.html` شغّل `npm run ios:sync` مرة ثانية عشان التعديل يوصل للتطبيق.

## النشر في App Store

1. في Xcode: **Product ← Archive**، وبعدها **Distribute App ← App Store Connect**.
2. في [App Store Connect](https://appstoreconnect.apple.com) أنشئ التطبيق بنفس الـ Bundle ID،
   وعبّي الوصف، الصور (screenshots لآيفون 6.9 إنش)، رابط سياسة الخصوصية، والتصنيف العمري.
3. أرسله للمراجعة.

### ملاحظات مهمة قبل الإرسال للمراجعة

- **قاعدة Firebase:** اللعبة تقرأ وتكتب في Realtime Database مباشرة. تأكد إن قواعد الأمان
  (Rules) في Firebase مو مفتوحة للكل (`".read": true, ".write": true`) قبل ما تنشر.
- **سياسة الخصوصية:** Apple تطلب رابط سياسة خصوصية لأي تطبيق يرسل بيانات لسيرفر.
- **التصنيف العمري:** لو التحديات فيها محتوى للكبار، اختر التصنيف المناسب (17+ / 18+).
- **قاعدة 4.2 (الحد الأدنى من الوظائف):** Apple أحياناً ترفض التطبيقات اللي هي مجرد موقع
  داخل غلاف. لعبتنا تعتبر تجربة تفاعلية كاملة وتشتغل من الملفات داخل التطبيق، فغالباً تمشي،
  لكن لو انرفضت نقدر نضيف مزايا native (إشعارات، اهتزاز Haptics، مشاركة كود الغرفة…).

## الأيقونة وشاشة البداية

- الأيقونة: `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png` (‏1024×1024)
- شاشة البداية: `ios/App/App/Assets.xcassets/Splash.imageset/`

الحالية مكبّرة من `icon-512.png`. لأفضل جودة حط صورة أصلية 1024×1024 بدون شفافية.
