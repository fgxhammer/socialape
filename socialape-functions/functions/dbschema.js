const db = {
  users: [
    {
      userId: "3LiyKwxeICfVKztRt3X1thtjXvv1",
      email: "user@email.com",
      handle: "user",
      createdAt: "2019-08-06T17:18:54.318Z",
      imageUrl: "image/asdöknöjsaD",
      bio: "Hello my name is user",
      website: "https://user.com",
      location: "London, UK"
    }
  ],
  screams: [
    {
      userHandle: "user",
      body: "body",
      createdAt: "2019-08-05T00:13:27.586Z",
      likeCount: 5,
      commentCount: 2
    }
  ],
  comments: [
    {
      userHandle: "user",
      screamId: "apsidapisunvalskdgjfjkv",
      body: "nice scream mate",
      createdAt: ""
    }
  ]
};

// Redux data
const userDetails = {
  credentials: {
    userId: "3LiyKwxeICfVKztRt3X1thtjXvv1",
    email: "user@email.com",
    handle: "user",
    createdAt: "2019-08-06T17:18:54.318Z",
    imageUrl: "image/asdöknöjsaD",
    bio: "Hello my name is user",
    website: "https://user.com",
    location: "London, UK"
  },
  likes: [
    {
      userHandle: "user",
      screamId: "asdnadöocmoasd"
    },
    {
      userHandle: "user",
      screamId: "asödnöonsdaisdsd"
    }
  ]
};
