const admin = require("firebase-admin");
const fs = require("fs");

// Initialize Firebase
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function exportCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  const data = [];
  
  snapshot.forEach(doc => {
    data.push({ id: doc.id, ...doc.data() });
  });

  fs.writeFileSync(`${collectionName}.json`, JSON.stringify(data, null, 2));
  console.log(`Exported ${collectionName} to ${collectionName}.json`);
}

// Specify the collection name you want to export, or loop through multiple collections
exportCollection("users"); // replace with your collection name
