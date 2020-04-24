/*Will have the objects of initialieApp(), and the database (firestore())*/
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

module.exports = {
  admin,
  db,
}
