# Notes for App Review (Apple / Google Play)

Paste the English text below into **App Review Information → Notes** (App Store Connect)
or **App access** (Play Console). Replace `VIDEO_LINK` with the link to the screen recording
(YouTube "Unlisted" or a Google Drive link anyone can open). The text stays under Apple's
4,000-character limit.

---

1. SCREEN RECORDING
Recorded on a physical iPhone running the latest iOS, starting from launching the app:
https://youtu.be/3qbwDu94YDI
It shows: launch, account registration (email and password), sign-in, starting a game in one-phone mode, all four games, switching the language, and account deletion (Terms & Conditions → "Delete my account and data").
- User-generated content: the app has no public content. Player names are only seen by the two players in the same private room, and the "Feedback & contact" form sends a private message to the developer only, so there is nothing other users can see to report or block.
- Paid content: none. The app has no ads and no in-app purchases.

2. PURPOSE AND AUDIENCE
Halalii is a fun, light game for married couples (adults 18+) who want to spend quality time together. It gives them conversation cards, "Know me?" questions, "Would you rather" questions and a lucky wheel, so they talk more, learn about each other and laugh together. Content is romantic but not explicit.

3. HOW TO USE THE APP (no sign-in needed)
1. Open the app. On the welcome screen tap "Try as a guest".
2. Tap "Start a new game".
3. Enter any name, pick Husband or Wife, then under "How will you play?" choose "One phone" and enter a partner name.
4. Tap "Create room". The game starts right away and the turn passes between the two players on the same phone.
5. Use the four tabs at the top: Cards, Know Me?, Would You Rather and Lucky Wheel. In Know Me? and Would You Rather a "Pass the phone" screen keeps the second player's answer secret; tap the button to continue.
Two-phone mode: one player creates a room and shares the code; the other taps "I have a code, join a game" and enters it.
Accounts are optional. To test them, tap "Create a new account" on the welcome screen and use any email and password; no demo account is needed. To delete the account: Terms & Conditions → "Delete my account and data".
The language follows the device (Arabic or English) and can be switched with the EN / عربي button on the home screen.

4. EXTERNAL SERVICES
- Google Firebase Authentication: guest (anonymous) and email/password accounts.
- Google Firebase Realtime Database: game rooms that sync between the two players, and anonymous usage counts.
- GitHub Pages: hosts the privacy policy and the invite link page.
No payment processors, no AI services, no ads or analytics SDKs.

5. REGIONAL DIFFERENCES
None. The app works the same in all regions; only the language (Arabic/English) changes.

6. REGULATED INDUSTRY / THIRD-PARTY MATERIAL
Not applicable. All questions and cards were written by the developer.

Privacy policy: https://rashedems-hub.github.io/couple-game/privacy.html
Contact: halalii.app@gmail.com
