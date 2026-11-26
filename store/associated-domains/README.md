# Password AutoFill (Associated Domains)

iOS only offers saved Keychain passwords inside the app, and offers to save new
ones, when the app and a website vouch for each other:

- The app lists `webcredentials:rashedems-hub.github.io` in
  `ios/App/App/App.entitlements`.
- The site serves `.well-known/apple-app-site-association` (the file next to this
  README) at `https://rashedems-hub.github.io/.well-known/apple-app-site-association`.

## Setup

1. Create a public repository named exactly `rashedems-hub.github.io` and turn on
   GitHub Pages for it (Settings → Pages → Deploy from a branch → `main`, root).
2. Copy `.well-known/apple-app-site-association` into it, plus an empty `.nojekyll`
   file at the root so GitHub Pages serves the dot-folder.
3. In developer.apple.com → Identifiers → `com.halalii.app`, turn on
   **Associated Domains** and save.
4. Run the iOS workflow and test the TestFlight build: sign in, sign out, then tap
   the email field; the saved login should appear above the keyboard.
