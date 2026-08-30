import admin from 'firebase-admin';

// Usage: node scripts/set_designer_label.js "<Designer Name>" "<Label text>"
// Pass an empty string as the label to clear it.
// Requires GOOGLE_APPLICATION_CREDENTIALS to point at a service account key (see VERCEL.md).

const [, , name, label] = process.argv;

if (!name || label === undefined) {
  console.error('Usage: node scripts/set_designer_label.js "<Designer Name>" "<Label text>"');
  process.exit(1);
}

admin.initializeApp();
const db = admin.firestore();

async function setLabel() {
  const snapshot = await db.collection('designers').where('name', '==', name).get();

  if (snapshot.empty) {
    console.error(`❌ No designer found with name "${name}"`);
    process.exit(1);
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, {
      label: label === '' ? admin.firestore.FieldValue.delete() : label
    });
  });
  await batch.commit();

  console.log(label === ''
    ? `✅ Cleared label for "${name}"`
    : `✅ Set label for "${name}" to "${label}"`);
  process.exit(0);
}

setLabel().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
