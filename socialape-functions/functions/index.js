const functions = require("firebase-functions");
const {
  getAllScreams,
  postOneScream,
  getOneScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream
} = require("./handlers/screams");
const {
  signUp,
  logIn,
  uploadUserImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead
} = require("./handlers/users");
const app = require("express")();
const FBAuth = require("./util/fbauth");
const { db } = require("./util/admin");

// USERS
// Signup route
app.post("/signup", signUp);
// Login route
app.post("/login", logIn);
// Upload profile picture
app.post("/user/image", FBAuth, uploadUserImage);
// Upload user details
app.post("/user", FBAuth, addUserDetails);
// Get  auth userdetails
app.get("/user", FBAuth, getAuthenticatedUser);
// Get userdetails
app.get("/user/:handle", getUserDetails);
// Mark notifications read
app.post("/notifications", FBAuth, markNotificationsRead);

// SCREAMS
// Get all screams
app.get("/screams", getAllScreams);
// Get spcific scream
app.get("/scream/:screamId", getOneScream);
// Upload scream
app.post("/scream", FBAuth, postOneScream);
// Delete scream
app.delete("/scream/:screamId", FBAuth, deleteScream);
// Create a commen on a scream
app.post("/scream/:screamId/comment", FBAuth, commentOnScream);
// Like scream
app.get("/scream/:screamId/like", FBAuth, likeScream);
// Unlike scream
app.get("/scream/:screamId/unlike", FBAuth, unlikeScream);

exports.api = functions.region("europe-west1").https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            read: false,
            screamId: doc.id, // == snapshot.data().screamId
            type: "like",
            createdAt: new Date().toISOString()
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  });

exports.deleteNotificationOnUnlike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onDelete(snapshot => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch(err => {
        console.error(err);
      });
  });

exports.createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            read: false,
            screamId: doc.id, // == snapshot.data().screamId
            type: "comment",
            createdAt: new Date().toISOString()
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  });

exports.onUserImageChange = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}")
  .onUpdate(change => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("Image has changed");
      const batch = db.batch();
      return db
        .collection("screams")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then(data => {
          data.forEach(doc => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    }
  });

exports.onScreamDelete = functions
  .region("europe-west1")
  .firestore.document("/screams/{screamId}")
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("screamId", "==", screamId)
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection("likes")
          .where("screamId", "==", screamId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("screamId", "==", screamId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch(err => {
        console.error(err);
      });
  });
