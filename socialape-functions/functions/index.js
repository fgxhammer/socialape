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
    db.doc(`/screams/${snapshot.data().screamId}`)
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
        return;
      });
  });

exports.deleteNotificationOnUnlike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onDelete(snapshot => {
    db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onCreate(snapshot => {
    db.doc(`/screams/${snapshot.data().screamId}`)
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
        return;
      });
  });
