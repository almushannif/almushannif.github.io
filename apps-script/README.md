Apps Script deployment notes

1. Open https://script.google.com and create a new project.
2. Copy the contents of apps-script/code.gs into the editor.
3. Save the project, then Deploy > New deployment > Select "Web app".
   - Execute as: Me
   - Who has access: Anyone (or Anyone with Google account)
4. Copy the Web App URL and paste it into assets/js/config.js as CONFIG.BASE_API_URL

Endpoints (example usage):
- POST to BASE_API_URL?action=login with JSON body { "id_token": "..." }
  - Verifies Google ID token via Google's tokeninfo endpoint and returns user info + role.
- GET BASE_API_URL?action=dashboard
  - Returns sample dashboard statistics.

Notes:
- This sample uses tokeninfo for quick verification. For production consider validating aud (client_id), exp, and using Google Cloud IAM or libraries.
- Protect sensitive operations by checking roles and verifying tokens on every request.
