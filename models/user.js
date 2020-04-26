var admin = require("firebase-admin");
var serviceAccount = require("../website-ngo98-firebase-adminsdk-vxw7y-0b58171e63.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://platform-be8b3.firebaseio.com",
    storageBucket: "platform-be8b3.appspot.com",
    projectId: 'platform-be8b3'
});

const db = admin.firestore();

var bucket = admin.storage().bucket();

module.exports = {
    db: db,
    bucket: bucket
}
