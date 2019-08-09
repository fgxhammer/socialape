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
  getAuthenticatedUser
} = require("./handlers/users");
const app = require("express")();
const FBAuth = require("./util/fbauth");

// USERS
// Signup route
app.post("/signup", signUp);
// Login route
app.post("/login", logIn);
// Upload profile picture
app.post("/user/image", FBAuth, uploadUserImage);
// Upload user details
app.post("/user", FBAuth, addUserDetails);
// Get userdetails
app.get("/user", FBAuth, getAuthenticatedUser);

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

//TODO: delete a scream
//TODO: like a scream
//TODO: unlike a scream
//TODO: comment a scream

exports.api = functions.region("europe-west1").https.onRequest(app);
