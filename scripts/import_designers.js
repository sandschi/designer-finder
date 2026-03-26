import admin from 'firebase-admin';

// Since we are running in the context of the firebase-mcp-server session,
// standard initializeApp() without args should find the active project.
// If not, we'll need a different approach.
admin.initializeApp();
const db = admin.firestore();

const designers = [
  {
    "id": "1763493037654",
    "name": "Laura",
    "address": "Eben in Tirol",
    "coords": {
      "lat": 47.4142646,
      "lon": 11.7629585,
      "displayName": "Eben in Tirol, Achenseestraße, Maurach, Eben am Achensee, Bezirk Schwaz, Tirol, 6212, Österreich",
      "countryCode": "at"
    },
    "displayAddress": "Eben in Tirol, Achenseestraße, Maurach, Eben am Achensee, Bezirk Schwaz, Tirol, 6212, Österreich",
    "createdAt": "2025-11-18T19:10:37.654Z"
  },
  {
    "id": "1763493109055",
    "name": "Mike",
    "address": "Zirl",
    "coords": {
      "lat": 47.2733773,
      "lon": 11.2422348,
      "displayName": "Zirl, Bezirk Innsbruck-Land, Tyrol, 6170, Austria",
      "countryCode": "at"
    },
    "displayAddress": "Zirl, Bezirk Innsbruck-Land, Tyrol, 6170, Austria",
    "createdAt": "2025-11-18T19:11:49.055Z"
  },
  {
    "id": "1763493123014",
    "name": "Sebi",
    "address": "Hallein",
    "coords": {
      "lat": 47.6821521,
      "lon": 13.0956313,
      "displayName": "Hallein, Bezirk Hallein, Salzburg, 5400, Austria",
      "countryCode": "at"
    },
    "displayAddress": "Hallein, Bezirk Hallein, Salzburg, 5400, Austria",
    "createdAt": "2025-11-18T19:12:03.014Z"
  },
  {
    "id": "1763493142965",
    "name": "Benjamin",
    "address": "Keutschach",
    "coords": {
      "lat": 46.5934581,
      "lon": 14.1872245,
      "displayName": "Keutschach am See, Bezirk Klagenfurt-Land, Carinthia, 9074, Austria",
      "countryCode": "at"
    },
    "displayAddress": "Keutschach am See, Bezirk Klagenfurt-Land, Carinthia, 9074, Austria",
    "createdAt": "2025-11-18T19:12:22.965Z"
  },
  {
    "id": "1763493216965",
    "name": "Stephan",
    "address": "Lindabrunn",
    "coords": {
      "lat": 47.9121904,
      "lon": 16.1710653,
      "displayName": "Katastralgemeinde Lindabrunn, Enzesfeld, Enzesfeld-Lindabrunn, Bezirk Baden, Lower Austria, Austria",
      "countryCode": "at"
    },
    "displayAddress": "Katastralgemeinde Lindabrunn, Enzesfeld, Enzesfeld-Lindabrunn, Bezirk Baden, Lower Austria, Austria",
    "createdAt": "2025-11-18T19:13:36.965Z"
  }
];

async function importData() {
  console.log('🚀 Starting import...');
  const batch = db.batch();
  
  designers.forEach((designer) => {
    const docRef = db.collection('designers').doc(designer.id);
    batch.set(docRef, designer);
  });
  
  await batch.commit();
  console.log('✅ Successfully imported all designers!');
  process.exit(0);
}

importData().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
