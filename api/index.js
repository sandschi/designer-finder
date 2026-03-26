import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';

// Initialize Firebase Admin with credentials from env or default
if (!admin.apps.length) {
    try {
        // If GOOGLE_APPLICATION_CREDENTIALS_JSON env var is set, use it
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } else {
            // Falls back to Google Application Default Credentials
            admin.initializeApp();
        }
        console.log('✅ Firebase Admin initialized');
    } catch (error) {
        console.error('❌ Failed to initialize Firebase:', error);
    }
}

const db = admin.firestore();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Get all designers
app.get('/api/designers', async (req, res) => {
    try {
        const snapshot = await db.collection('designers').get();
        const designers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(designers);
    } catch (error) {
        console.error('Error reading designers:', error);
        res.status(500).json({ error: 'Failed to read designers' });
    }
});

export default app;
