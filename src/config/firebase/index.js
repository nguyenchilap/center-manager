const { storage } = require('firebase-admin');
const firebaseAdmin = require('firebase-admin');
const {v4: uuidv4} = require('uuid');

const serviceAccount = require('./center-management-10f9c-firebase-adminsdk-r2g56-ade2f7c578.json');

//initialize app
const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});

const storageRef = admin.storage().bucket('gs://center-management-10f9c.appspot.com');


module.exports = {
    uploadStudentImage : async function(path, filename, studentId) {
        const storage = await storageRef.upload(path, {
            public: true,
            destination: `students/${studentId}/image/${filename}`,
            metadata: {
                firebaseStorageDownloadTokens: uuidv4(),
            }
        })
        return storage[0].metadata.mediaLink;
    },
}