# Deploying to Vercel 🚀

The project has been refactored for Vercel deployment, moving from a Docker-based architecture to a serverless one.

## 🛠 Prerequisites

1.  **Vercel Account:** Connect your GitHub repository to Vercel.
2.  **Firebase Project:** I have already initialized a Firebase project (`designer-finder-sandschi`) and set up Firestore.

## 🔑 Environment Variables

To allow the Vercel API to communicate with Firestore, you must set the following environment variable in your Vercel project settings:

### `FIREBASE_SERVICE_ACCOUNT`
This should be the JSON content of your Firebase Service Account key.

**How to get it:**
1. Go to the [Firebase Console](https://console.firebase.google.com/project/designer-finder-sandschi/settings/serviceaccounts/adminsdk).
2. Click **"Generate new private key"**.
3. Download the JSON file.
4. Open the JSON, copy its entire content, and paste it into the Vercel variable field.

## 📦 Importing Existing Data

I've created a script to help you move your `data.json` designers quickly:

1.  Make sure you have your newly created service account JSON file.
2.  Set a temporary environment variable on your computer: 
    *   **Windows:** `$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your\key.json"`
3.  Run the import script:
    ```bash
    node scripts/import_designers.js
    ```
4.  Once it says ✅, your data is live in Firestore!

## 📁 Project Structure Changes

- **`api/`**: Contains the serverless function (Express logic) that handles designer data.
- **`vercel.json`**: Configures the rewrites to route `/api/*` requests to our serverless function.
- **`src/context/DesignerContext.jsx`**: Updated to support both local and production environments automatically.

## 📝 Persistence
The app now uses **Google Cloud Firestore** for data storage. This ensures your data persists even when serverless functions cold-start, unlike the previous `data.json` file.

## 🚀 How to Deploy

1.  Push these changes to your GitHub repository.
2.  Import the project in Vercel.
3.  Add the `FIREBASE_SERVICE_ACCOUNT` environment variable.
4.  Deploy!
